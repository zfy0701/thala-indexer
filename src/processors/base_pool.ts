import { BigDecimal, Gauge } from "@sentio/sdk";
import { AptosContext } from "@sentio/sdk/aptos";
import {
  bigintToInteger,
  GALXE_QUESTS,
  getCoinDecimals,
  getPairTag,
  getPriceAsof,
  MOD,
  scaleDown,
  USDC,
} from "../utils.js";

const commonOptions = {
  sparse: true,
};

const volOptions = {
  sparse: true,
  aggregationConfig: {
    intervalInMinutes: [60],
  },
};

const ammCoinPriceGauge = Gauge.register("amm_coin_price", commonOptions);
const tvlGauge = Gauge.register("pool_tvl_usd", commonOptions);
const volumeGauge = Gauge.register("pool_volume_usd", volOptions);
const feeGauge = Gauge.register("pool_swap_fee_usd", volOptions);

export async function onEventSwapEvent(
  ctx: AptosContext,
  type: "weighted" | "stable",
  coins: string[],
  poolTag: string,
  relativePrices: number[],
  idx_in: bigint,
  idx_out: bigint,
  amount_in: bigint,
  amount_out: bigint,
  fee_amount: bigint,
  pool_balance_0: bigint,
  pool_balance_1: bigint,
  pool_balance_2: bigint,
  pool_balance_3: bigint
) {
  if (
    coins[Number(idx_in)] === MOD &&
    coins[Number(idx_out)] === USDC
  ) {
    ctx.eventLogger.emit(GALXE_QUESTS.SWAP_MOD_TO_USDC, {
      distinctId: ctx.transaction.sender,
    });
  }

  const actualCoinPrices = await getActualCoinPrices(
    coins,
    relativePrices,
    Number(ctx.transaction.timestamp) / 1000
  );

  const decimals = coins.map(getCoinDecimals);
  const idxIn = bigintToInteger(idx_in);
  const idxOut = bigintToInteger(idx_out);

  const swapAmountIn = scaleDown(amount_in, decimals[idxIn]);
  const swapAmountOut = scaleDown(amount_out, decimals[idxOut]);

  const coinIn = coins[idxIn];
  const coinOut = coins[idxOut];

  const actualCoinInPrice = actualCoinPrices[idxIn];
  const actualCoinOutPrice = actualCoinPrices[idxOut];
  const volumeUsd = swapAmountIn.multipliedBy(actualCoinInPrice);
  const feeUsd = scaleDown(fee_amount, decimals[idxIn]).multipliedBy(
    actualCoinInPrice
  );

  const pairTag = getPairTag(coinIn, coinOut);
  ammCoinPriceGauge.record(ctx, actualCoinInPrice, {
    pairTag,
    coin: coinIn,
  });
  ammCoinPriceGauge.record(ctx, actualCoinOutPrice, {
    pairTag,
    coin: coinOut,
  });

  const swapAttributes = {
    pair:
      coinIn.localeCompare(coinOut) < 0
        ? `${coinIn}-${coinOut}`
        : `${coinOut}-${coinIn}`,
    coin_address_in: coinIn,
    coin_address_out: coinOut,
    amount_in: swapAmountIn,
    amount_out: swapAmountOut,
    price_in: actualCoinInPrice,
    price_out: actualCoinOutPrice,
    volume: volumeUsd,
    fee: feeUsd,
    type,
  };

  ctx.eventLogger.emit("swap", {
    distinctId: ctx.transaction.sender,
    message: `Swap ${swapAmountIn} ${coinIn} for ${swapAmountOut} ${coinOut}`,
    ...swapAttributes,
  });

  // TVL
  const balances = [
    pool_balance_0,
    pool_balance_1,
    pool_balance_2,
    pool_balance_3,
  ]
    .slice(0, coins.length)
    .map((e, i) => scaleDown(e, decimals[i]));

  const tvlUsd = balances
    .map((balance, i) => balance.multipliedBy(actualCoinPrices[i]))
    .reduce((acc, e) => acc.plus(e), new BigDecimal(0));

  tvlGauge.record(ctx, tvlUsd, { poolTag });
  volumeGauge.record(ctx, volumeUsd, { poolTag });
  feeGauge.record(ctx, feeUsd, { poolTag });
}

export async function onEventLiquidityEvent(
  ctx: AptosContext,
  liquidityEventType: "Add" | "Remove",
  coins: string[],
  pool: string,
  relativePrices: number[],
  amounts: bigint[]
) {
  if (liquidityEventType === "Add" && coins.length == 2 && coins.includes(MOD) && coins.includes(USDC)) {
    ctx.eventLogger.emit(GALXE_QUESTS.ADD_MOD_USDC_LP, {
      distinctId: ctx.transaction.sender,
    });
  }

  const actualCoinPrices = await getActualCoinPrices(
    coins,
    relativePrices,
    Number(ctx.transaction.timestamp) / 1000
  );

  const decimals = coins.map(getCoinDecimals);
  const amountsScaled = amounts
    .slice(0, coins.length)
    .map((e, i) => scaleDown(e, decimals[i]));
  const usdValue = amountsScaled
    .map((amount, i) => amount.multipliedBy(actualCoinPrices[i]))
    .reduce((acc, e) => acc.plus(e), new BigDecimal(0));

  ctx.eventLogger.emit("liquidity", {
    distinctId: ctx.transaction.sender,
    liquidityEventType,
    pool,
    value: usdValue.isNaN() ? new BigDecimal(0) : usdValue,
  });
}

// get usd prices based on the first asset with known price (which is available via price API)
// if none of the assets have known price, use 0
// returns an array of price for each asset
async function getActualCoinPrices(
  coins: string[],
  relativePrices: number[],
  timestampMillis: number
): Promise<number[]> {
  let knownPriceIdx = 0;
  let knownPrice = 0;
  while (knownPriceIdx < coins.length) {
    knownPrice = await getPriceAsof(
      coins[knownPriceIdx],
      new Date(timestampMillis)
    );
    if (knownPrice) {
      break;
    }
    knownPriceIdx += 1;
  }

  return knownPrice == 0
    ? Array(coins.length).fill(0)
    : relativePrices.map(
        (e) => (knownPrice / relativePrices[knownPriceIdx]) * e
      );
}
