import {
  base_pool,
  weighted_pool,
  weighted_pool_scripts,
} from "../types/aptos/amm.js";
import {
  getCoinDecimals,
  getPriceAsof,
  scaleDown,
} from "../../../../src/utils.js";

import {
  AptosAccountProcessor,
  AptosContext,
  defaultMoveCoder,
} from "@sentio/sdk/aptos";
import {
  onEventLiquidityEvent,
  onEventSwapEvent,
  tvlByPoolGauge,
} from "./base_pool.js";
import { BigDecimal } from "@sentio/sdk";

const START_VERSION = 104592735;

const NULL_TYPE = `${weighted_pool.DEFAULT_OPTIONS.address}::base_pool::Null`;

weighted_pool
  .bind({ startVersion: START_VERSION })
  .onEventSwapEvent(
    async (event: weighted_pool.SwapEventInstance, ctx: AptosContext) => {
      const { coins, weights } = getCoinsAndWeights(event);
      const poolType = getPoolType(event);

      const relativePrices = getRelativePrices(coins, weights, [
        event.data_decoded.pool_balance_0,
        event.data_decoded.pool_balance_1,
        event.data_decoded.pool_balance_2,
        event.data_decoded.pool_balance_3,
      ]);

      await onEventSwapEvent(
        ctx,
        "weighted",
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
  .onEventWeightedPoolCreationEvent(async (event, ctx) => {
    const { coins, weights } = getCoinsAndWeights(event);
    const poolType = getPoolType(event);

    const relativePrices = getRelativePrices(coins, weights, [
      event.data_decoded.amount_0,
      event.data_decoded.amount_1,
      event.data_decoded.amount_2,
      event.data_decoded.amount_3,
    ]);

    ctx.eventLogger.emit("create_pool", {
      distinctId: ctx.transaction.sender,
      pool: poolType,
      timestamp: ctx.transaction.timestamp,
    });

    await onEventLiquidityEvent(ctx, "Add", coins, poolType, relativePrices, [
      event.data_decoded.amount_0,
      event.data_decoded.amount_1,
      event.data_decoded.amount_2,
      event.data_decoded.amount_3,
    ]);
  })
  .onEventAddLiquidityEvent(async (event, ctx) => {
    const { coins, weights } = getCoinsAndWeights(event);
    const poolType = getPoolType(event);

    const relativePrices = getRelativePrices(coins, weights, [
      event.data_decoded.amount_0,
      event.data_decoded.amount_1,
      event.data_decoded.amount_2,
      event.data_decoded.amount_3,
    ]);

    await onEventLiquidityEvent(ctx, "Add", coins, poolType, relativePrices, [
      event.data_decoded.amount_0,
      event.data_decoded.amount_1,
      event.data_decoded.amount_2,
      event.data_decoded.amount_3,
    ]);
  })
  .onEventRemoveLiquidityEvent(async (event, ctx) => {
    const { coins, weights } = getCoinsAndWeights(event);
    const poolType = getPoolType(event);

    const relativePrices = getRelativePrices(coins, weights, [
      event.data_decoded.amount_0,
      event.data_decoded.amount_1,
      event.data_decoded.amount_2,
      event.data_decoded.amount_3,
    ]);

    await onEventLiquidityEvent(
      ctx,
      "Remove",
      coins,
      poolType,
      relativePrices,
      [
        event.data_decoded.amount_0,
        event.data_decoded.amount_1,
        event.data_decoded.amount_2,
        event.data_decoded.amount_3,
      ]
    );
  });

weighted_pool_scripts
  .bind({ startVersion: START_VERSION })
  .onTransaction((tx, ctx) => {
    ctx.meter.Counter("total_txn").add(1, { type: "weighted_pool" });
  });

AptosAccountProcessor.bind({
  address: weighted_pool.DEFAULT_OPTIONS.address,
  startVersion: START_VERSION,
}).onVersionInterval(async (resources, ctx) => {
  const asof = new Date(ctx.timestampInMicros / 1000);
  const pools = defaultMoveCoder().filterAndDecodeResources<
    weighted_pool.WeightedPool<any, any, any, any, any, any, any, any>
  >(weighted_pool.WeightedPool.TYPE_QNAME, resources);
  console.log("number of weighted pools:", pools.length);

  for (const pool of pools) {
    const nullIndex = pool.type_arguments
      .slice(0, 4)
      .indexOf(base_pool.Null.TYPE_QNAME);
    const numCoins = nullIndex === -1 ? 4 : nullIndex;

    const coinTypes = pool.type_arguments.slice(0, numCoins);
    const coinPrices = await Promise.all(
      coinTypes.map((coinType) => getPriceAsof(coinType, asof))
    );
    const coinAmounts: BigDecimal[] = [...Array(numCoins).keys()].map((i) =>
      scaleDown(
        // @ts-ignore
        (pool.data_decoded[`asset_${i}`] as { value: bigint }).value,
        getCoinDecimals(coinTypes[i])
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
// if any coin is Null, returned price is 0
// params:
// coins: array of coin addresses
// weights: array of weights (0 ~ 1)
// amounts: array of amounts of bigint (either pool balances or proportionally added/removed liquidity amounts)
function getRelativePrices(
  coins: string[],
  weights: number[],
  amounts: bigint[]
): number[] {
  const decimals = coins.map(getCoinDecimals);

  const numCoins = coins.length;
  const amountsScaled = amounts
    .slice(0, numCoins)
    .map((e, i) => scaleDown(e, decimals[i]));

  // formula: https://docs.balancer.fi/v/v1/core-concepts/protocol/index#spot-price
  // price1to0 = (balance0 / balance1) * (weight1 / weight0)
  return [
    1,
    ...weights
      .slice(1, numCoins)
      .map(
        (w, i) =>
          (amountsScaled[0].div(amountsScaled[i + 1]).toNumber() * w) /
          weights[0]
      ),
  ];
}

function getCoinsAndWeights(
  event:
    | weighted_pool.SwapEventInstance
    | weighted_pool.AddLiquidityEventInstance
    | weighted_pool.RemoveLiquidityEventInstance
): {
  coins: string[];
  weights: number[];
} {
  const coins = [];
  const weights = [];
  coins.push(event.type_arguments[0]);
  coins.push(event.type_arguments[1]);

  weights.push(parseWeight(event.type_arguments[4]));
  weights.push(parseWeight(event.type_arguments[5]));

  const coin2 = event.type_arguments[2];
  if (!isNullType(coin2)) {
    coins.push(coin2);
    weights.push(parseWeight(event.type_arguments[6]));
  }

  const coin3 = event.type_arguments[3];
  if (!isNullType(coin3)) {
    coins.push(coin3);
    weights.push(parseWeight(event.type_arguments[7]));
  }

  return { coins, weights };
}

// weight typeArg format is like "0x1234::weighted_pool::Weight_5"
// returns the floating point number e.g. 0.05
function parseWeight(typeArg: string): number {
  const list = typeArg.split("_");
  return parseFloat(list[list.length - 1]) / 100;
}

function isNullType(typeArg: string): boolean {
  return typeArg === NULL_TYPE;
}

// get complete pool type name. notice: there's a space after ", ". example:
// 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::weighted_pool::WeightedPool<0x347b2ef2a5509414630d939e6cedb0c7fae5e1a295bf93587fec19cac34ba5b::mod_coin::MOD, 0x3c27315fb69ba6e4b960f1507d1cefcc9a4247869f26a8d59d6b7869d23782c::test_coins::USDC, 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::base_pool::Null, 0xf727908689c999b8aa9ad6bd2d73b964bcc65a700dbbcc234d02827e2fc71d56::base_pool::Null>
function getPoolType(
  event:
    | weighted_pool.AddLiquidityEventInstance
    | weighted_pool.RemoveLiquidityEventInstance
    | weighted_pool.SwapEventInstance
) {
  return `${
    weighted_pool.DEFAULT_OPTIONS.address
  }::weighted_pool::WeightedPool<${event.type_arguments
    .map((e) => e.trim())
    .join(", ")}>`;
}
