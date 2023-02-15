import { BigDecimal, Gauge } from "@sentio/sdk";
import { AptosContext } from "@sentio/sdk/aptos";
import {
  bigintToInteger,
  getCoinDecimals,
  getPairTag,
  getPriceAsof,
  scaleDown,
} from "../utils.js";

const ammCoinPriceGauge = Gauge.register("amm_coin_price", { sparse: true });
const poolTvlUsdGauge = Gauge.register("pool_tvl_usd", { sparse: true });

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
  // actual prices
  const actualCoin0Price = await getPriceAsof(
    coins[0],
    new Date(Number(ctx.transaction.timestamp) / 1000)
  );
  const actualCoinPrices = relativePrices.map((e) => e * actualCoin0Price);

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
    fee_amount: fee_amount,
    type,
  };

  ctx.eventLogger.emit("swap", {
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
  poolTvlUsdGauge.record(ctx, tvlUsd, { poolTag });

  ctx.meter.Counter("pool_volume_usd").add(volumeUsd, { poolTag });

  ctx.meter
    .Counter("pool_swap_fee_usd")
    .add(
      scaleDown(fee_amount, decimals[idxIn]).multipliedBy(actualCoinInPrice),
      { poolTag }
    );
}