import {
  base_pool,
  stable_pool,
  stable_pool_scripts,
} from "../types/aptos/amm.js";

import {
  AptosResourcesProcessor,
  AptosContext,
  defaultMoveCoder,
} from "@sentio/sdk/aptos";
import {
  bigintToInteger,
  onEventLiquidityEvent,
  onEventSwapEvent,
  tvlByPoolGauge,
} from "./base_pool.js";
import { BigDecimal } from "@sentio/sdk";
import { getCoinInfo, getPrice } from "@sentio/sdk/aptos/ext";

const START_VERSION = 104592735;

const EPSILON = 0.000001; // 10e-6, for detecting convergence in stableswap math
const MAX_LOOP_LIMIT = 100;

const NULL_TYPE = `${stable_pool.DEFAULT_OPTIONS.address}::base_pool::Null`;

// for stable pool add/remove liquidity event: we allow disproportional liquidity, so there's no way to
// derive spot price based on amounts added/removed
// we assume relative prices are all one for stable pool
const RELATIVE_PRICES_ONE = [1, 1, 1, 1];

stable_pool
  .bind({ startVersion: START_VERSION })
  .onEventSwapEvent(
    async (event: stable_pool.SwapEventInstance, ctx: AptosContext) => {
      const coins = getCoins(event);
      const poolType = getPoolType(event);

      const relativePrices = getRelativePrices(event, coins);

      await onEventSwapEvent(
        ctx,
        "stable",
        coins,
        poolType,
        relativePrices,
        event.data_decoded.idx_in,
        event.data_decoded.idx_out,
        event.data_decoded.amount_in,
        event.data_decoded.amount_out,
        event.data_decoded.fee_amount
      );
    }
  )
  .onEventStablePoolCreationEvent(async (event, ctx) => {
    const coins = getCoins(event);
    const poolType = getPoolType(event);

    ctx.eventLogger.emit("create_pool", {
      distinctId: ctx.transaction.sender,
      pool: poolType,
      timestamp: ctx.transaction.timestamp,
    });

    await onEventLiquidityEvent(
      ctx,
      "Add",
      coins,
      poolType,
      RELATIVE_PRICES_ONE,
      [
        event.data_decoded.amount_0,
        event.data_decoded.amount_1,
        event.data_decoded.amount_2,
        event.data_decoded.amount_3,
      ]
    );
  })
  .onEventAddLiquidityEvent(async (event, ctx) => {
    const coins = getCoins(event);
    const poolType = getPoolType(event);

    await onEventLiquidityEvent(
      ctx,
      "Add",
      coins,
      poolType,
      RELATIVE_PRICES_ONE,
      [
        event.data_decoded.amount_0,
        event.data_decoded.amount_1,
        event.data_decoded.amount_2,
        event.data_decoded.amount_3,
      ]
    );
  })
  .onEventRemoveLiquidityEvent(async (event, ctx) => {
    const coins = getCoins(event);
    const poolType = getPoolType(event);

    await onEventLiquidityEvent(
      ctx,
      "Remove",
      coins,
      poolType,
      RELATIVE_PRICES_ONE,
      [
        event.data_decoded.amount_0,
        event.data_decoded.amount_1,
        event.data_decoded.amount_2,
        event.data_decoded.amount_3,
      ]
    );
  });

stable_pool_scripts
  .bind({ startVersion: START_VERSION })
  .onTransaction((tx, ctx) => {
    ctx.meter.Counter("total_txn").add(1, { type: "stable_pool" });
  });

AptosResourcesProcessor.bind({
  address: stable_pool.DEFAULT_OPTIONS.address,
  startVersion: START_VERSION,
}).onVersionInterval(async (resources, ctx) => {
  const pools = defaultMoveCoder().filterAndDecodeResources<
    stable_pool.StablePool<any, any, any, any>
  >(stable_pool.StablePool.TYPE_QNAME, resources);
  console.log("number of stable pools:", pools.length);

  for (const pool of pools) {
    const nullIndex = pool.type_arguments.indexOf(base_pool.Null.TYPE_QNAME);
    const numCoins = nullIndex === -1 ? 4 : nullIndex;

    const coinTypes = pool.type_arguments.slice(0, numCoins);
    const coinPrices = await Promise.all(
      coinTypes.map((coinType) => getPrice(coinType, ctx.timestampInMicros))
    );
    const coinAmounts: BigDecimal[] = [...Array(numCoins).keys()].map((i) =>
      // @ts-ignore
      (pool.data_decoded[`asset_${i}`] as { value: bigint }).value.scaleDown(
        getCoinInfo(coinTypes[i]).decimals
      )
    );
    const tvl = coinAmounts.reduce(
      (acc, amount, i) => acc.plus(amount.times(coinPrices[i])),
      BigDecimal(0)
    );

    tvlByPoolGauge.record(ctx, tvl, { poolType: pool.type });
  }
});

// get the relative price of for each asset based on coin 0, returns an array of relative prices
// if any coin is Null, the price is undefined
function getRelativePrices(
  event: stable_pool.SwapEventInstance,
  coins: string[]
): number[] {
  const numCoins = coins.length;

  const balance0 = event.data_decoded.pool_balance_0.scaleDown(
    getCoinInfo(coins[0]).decimals
  );
  const balance1 = event.data_decoded.pool_balance_1.scaleDown(
    getCoinInfo(coins[1]).decimals
  );

  const balances = [balance0.toNumber(), balance1.toNumber()];
  if (numCoins > 2) {
    const balance2 = event.data_decoded.pool_balance_2.scaleDown(
      getCoinInfo(coins[2]).decimals
    );
    balances.push(balance2.toNumber());
  }
  if (numCoins > 3) {
    const balance3 = event.data_decoded.pool_balance_3.scaleDown(
      getCoinInfo(coins[3]).decimals
    );
    balances.push(balance3.toNumber());
  }

  const amp = bigintToInteger(event.data_decoded.amp_factor);
  const d = getD(balances, amp);

  return [
    1,
    getStablePrice(0, 1, balances, amp, d),
    numCoins > 2 ? getStablePrice(0, 2, balances, amp, d) : 0,
    numCoins > 3 ? getStablePrice(0, 3, balances, amp, d) : 0,
  ];
}

function getCoins(
  event:
    | stable_pool.SwapEventInstance
    | stable_pool.AddLiquidityEventInstance
    | stable_pool.RemoveLiquidityEventInstance
): string[] {
  const coins = [];
  coins.push(event.type_arguments[0]);
  coins.push(event.type_arguments[1]);

  const coin2 = event.type_arguments[2];
  if (!isNullType(coin2)) {
    coins.push(coin2);
  }

  const coin3 = event.type_arguments[3];
  if (!isNullType(coin3)) {
    coins.push(coin3);
  }

  return coins;
}

function isNullType(typeArg: string): boolean {
  return typeArg === NULL_TYPE;
}

// get complete pool type name. notice: there's a space after ", ". example:
// 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::stable_pool::StablePool<0x347b2ef2a5509414630d939e6cedb0c7fae5e1a295bf93587fec19cac34ba5b::mod_coin::MOD, 0x3c27315fb69ba6e4b960f1507d1cefcc9a4247869f26a8d59d6b7869d23782c::test_coins::USDC, 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::base_pool::Null, 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::base_pool::Null>
function getPoolType(
  event:
    | stable_pool.AddLiquidityEventInstance
    | stable_pool.RemoveLiquidityEventInstance
    | stable_pool.SwapEventInstance
) {
  return `${
    stable_pool.DEFAULT_OPTIONS.address
  }::stable_pool::StablePool<${event.type_arguments
    .map((e) => e.trim())
    .join(", ")}>`;
}

// get relative price of coin j to i
// formula: https://linear.app/thala-labs/issue/THA-434/calculate-swap-price-impact
function getStablePrice(
  i: number,
  j: number,
  balances: number[],
  amp: number,
  d: number
): number {
  const n = balances.length;
  let b = Math.pow(d, n + 1) / Math.pow(n, n);
  balances.forEach((x: number, index: number) => {
    if (index != i && index != j) {
      b = b / x;
    }
  });
  let naxx = n * amp * balances[i] * balances[i] * balances[j] * balances[j];
  return (balances[i] * b + naxx) / (balances[j] * b + naxx);
}

// see `compute_invarient` in https://github.com/ThalaLabs/thala-modules/blob/main/thalaswap_math/sources/stable_math.move
function getD(xp: number[], a: number): number {
  const n = xp.length;

  // sum
  const s = xp.reduce((partialSum, a) => partialSum + a, 0);

  if (s == 0) {
    return 0;
  }

  let prev_d: number;
  let d = s;
  const ann = a * n;

  let i = 0;
  while (i < MAX_LOOP_LIMIT) {
    let dp = d;

    let j = 0;
    while (j < n) {
      dp = (dp * d) / (xp[j] * n);
      j = j + 1;
    }

    prev_d = d;
    d = ((ann * s + n * dp) * d) / ((ann - 1) * d + (n + 1) * dp);
    if (Math.abs(prev_d - d) < EPSILON) {
      return d;
    }

    i = i + 1;
  }

  throw new Error(`not converged in getD, xp: ${xp}, a: ${a}`);
}
