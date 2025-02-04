import { BigDecimal, Gauge } from "@sentio/sdk";
import { AptosContext } from "@sentio/sdk/aptos";
import { getCoinInfo, getPrice } from "@sentio/sdk/aptos/ext";

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
const liquidityGauge = Gauge.register("pool_liquidity_usd", commonOptions);
export const tvlByPoolGauge = Gauge.register("tvl_by_pool", commonOptions);
const volumeGauge = Gauge.register("pool_volume_usd", volOptions);
const feeGauge = Gauge.register("pool_swap_fee_usd", volOptions);

export async function onEventSwapEvent(
  ctx: AptosContext,
  type: "weighted" | "stable",
  coins: string[],
  poolType: string,
  relativePrices: number[],
  idx_in: bigint,
  idx_out: bigint,
  amount_in: bigint,
  amount_out: bigint,
  fee_amount: bigint
) {
  const actualCoinPrices = await getActualCoinPrices(
    coins,
    relativePrices,
    Number(ctx.transaction.timestamp)
  );

  const decimals = coins.map((coin) => getCoinInfo(coin).decimals);
  const idxIn = bigintToInteger(idx_in);
  const idxOut = bigintToInteger(idx_out);

  const swapAmountIn = amount_in.scaleDown(decimals[idxIn]);
  const swapAmountOut = amount_out.scaleDown(decimals[idxOut]);

  const coinIn = coins[idxIn];
  const coinOut = coins[idxOut];

  const actualCoinInPrice = actualCoinPrices[idxIn];
  const actualCoinOutPrice = actualCoinPrices[idxOut];
  const volumeUsd = swapAmountIn.multipliedBy(actualCoinInPrice);
  const feeUsd = fee_amount
    .scaleDown(decimals[idxIn])
    .multipliedBy(actualCoinInPrice);

  const pairTag = getPairTag(coinIn, coinOut);
  ammCoinPriceGauge.record(ctx, actualCoinInPrice, {
    pairTag,
    coin: coinIn,
  });
  ammCoinPriceGauge.record(ctx, actualCoinOutPrice, {
    pairTag,
    poolType,
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

  volumeGauge.record(ctx, volumeUsd, { poolType });
  feeGauge.record(ctx, feeUsd, { poolType });
}

export async function onEventLiquidityEvent(
  ctx: AptosContext,
  liquidityEventType: "Add" | "Remove",
  coins: string[],
  poolType: string,
  relativePrices: number[],
  amounts: bigint[]
) {
  const actualCoinPrices = await getActualCoinPrices(
    coins,
    relativePrices,
    Number(ctx.transaction.timestamp)
  );

  const decimals = coins.map((coin) => getCoinInfo(coin).decimals);
  const amountsScaled = amounts
    .slice(0, coins.length)
    .map((e, i) => e.scaleDown(decimals[i]));
  const usdValue = amountsScaled
    .map((amount, i) => amount.multipliedBy(actualCoinPrices[i]))
    .reduce((acc, e) => acc.plus(e), new BigDecimal(0));

  const value = usdValue.isNaN() ? new BigDecimal(0) : usdValue;
  ctx.eventLogger.emit("liquidity", {
    distinctId: ctx.transaction.sender,
    liquidityEventType,
    poolType,
    value,
  });

  const relativeUsdValue =
    liquidityEventType === "Add" ? value : value.times(-1);
  liquidityGauge.record(ctx, relativeUsdValue, { poolType });
}

// get usd prices based on the first asset with known price (which is available via price API)
// if none of the assets have known price, use 0
// returns an array of price for each asset
async function getActualCoinPrices(
  coins: string[],
  relativePrices: number[],
  timestampMicros: number
): Promise<number[]> {
  let knownPriceIdx = 0;
  let knownPrice = 0;
  while (knownPriceIdx < coins.length) {
    knownPrice = await getPrice(coins[knownPriceIdx], timestampMicros);
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

// use "123456coin1Name-789012coin2Name" as pair tag for each pool
// the first 6 digits of coin address are used to reduce the length of the tag
// tags are sorted alphabetically
function getPairTag(coin0: string, coin1: string): string {
  const fragments0 = coin0.split("::");
  const coinTag0 =
    fragments0[0].slice(2, 8) + fragments0[fragments0.length - 1];
  const fragments1 = coin1.split("::");
  const coinTag1 =
    fragments1[0].slice(2, 8) + fragments1[fragments1.length - 1];
  return coinTag0.localeCompare(coinTag1) < 0
    ? coinTag0.concat("-").concat(coinTag1)
    : coinTag1.concat("-").concat(coinTag0);
}

export function bigintToInteger(a: bigint): number {
  if (a > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("too large");
  }
  return Number(a);
}
