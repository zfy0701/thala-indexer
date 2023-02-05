import { weighted_pool } from "../types/aptos/testnet/amm";
import {
  bigintToInteger,
  getCoinDecimals,
  getPairTag,
  getPriceAsof,
  scaleDown,
} from "../utils";

import { BigDecimal, Gauge } from "@sentio/sdk";
import { AptosContext } from "@sentio/sdk-aptos";

const START_VERSION = 421368795;

const NULL_TYPE = `${weighted_pool.DEFAULT_OPTIONS.address}::base_pool::Null`;

// all coin prices are relative to coin0
const coin1PriceGauge = Gauge.register("weighted_price_coin_1", {
  sparse: true,
});
const coin2PriceGauge = Gauge.register("weighted_price_coin_2", {
  sparse: true,
});
const coin3PriceGauge = Gauge.register("weighted_price_coin_3", {
  sparse: true,
});

export function processor() {
  weighted_pool
    .bind({ startVersion: START_VERSION })
    .onEventSwapEvent(
      async (event: weighted_pool.SwapEventInstance, ctx: AptosContext) => {
        const { coins, weights } = getCoinsAndWeights(event);
        const poolTag = getPoolTag(coins, weights);
        const { coin1Price, coin2Price, coin3Price } = getPrices(
          event,
          coins,
          weights
        );

        // actual price 0
        const actualCoin0Price = await getPriceAsof(
          coins[0],
          new Date(Number(ctx.transaction.timestamp) / 1000)
        );

        // relative price 1
        const pair1Tag = getPairTag(coins[0], coins[1]);
        coin1PriceGauge.record(ctx, coin1Price, { poolTag, pairTag: pair1Tag });

        // relative price 2
        if (coin2Price) {
          const pair2Tag = getPairTag(coins[0], coins[2]);
          coin2PriceGauge.record(ctx, coin2Price, {
            poolTag,
            pairTag: pair2Tag,
          });
        }

        // relative price 3
        if (coin3Price) {
          const pair3Tag = getPairTag(coins[0], coins[3]);
          coin3PriceGauge.record(ctx, coin3Price, {
            poolTag,
            pairTag: pair3Tag,
          });
        }

        const relativePricesToCoin0 = [
          1,
          coin1Price,
          coin2Price || 0,
          coin3Price || 0,
        ];

        const coinTypes = event.type_arguments.slice(0, 4);
        const decimals = coinTypes.map(getCoinDecimals);

        const idxIn = bigintToInteger(event.data_decoded.idx_in);
        const idxOut = bigintToInteger(event.data_decoded.idx_out);

        const swapAmountIn = scaleDown(
          event.data_decoded.amount_in,
          decimals[idxIn]
        );
        const swapAmountOut = scaleDown(
          event.data_decoded.amount_out,
          decimals[idxOut]
        );

        const coinIn = coins[idxIn];
        const coinOut = coins[idxOut];
        const pair =
          coinIn.localeCompare(coinOut) < 0
            ? `${coinIn}-${coinOut}`
            : `${coinOut}-${coinIn}`;

        const actualCoinPrices = relativePricesToCoin0.map(
          (e) => e * actualCoin0Price
        );
        const actualCoinInPrice = actualCoinPrices[idxIn];
        const actualCoinOutPrice = actualCoinPrices[idxOut];
        const volumeUsd = swapAmountIn.multipliedBy(actualCoinInPrice);

        const swapAttributes = {
          pair,
          coin_address_in: coinIn,
          coin_address_out: coinOut,
          amount_in: swapAmountIn,
          amount_out: swapAmountOut,
          price_in: actualCoinInPrice,
          price_out: actualCoinOutPrice,
          volume: volumeUsd,
          fee_amount: event.data_decoded.fee_amount,
          type: "weighted",
        };

        ctx.logger.info(
          `swap: ${swapAmountIn} ${coinIn} for ${swapAmountOut} ${coinOut} in weighted_pool`,
          swapAttributes
        );

        // TVL
        const balances = [
          event.data_decoded.pool_balance_0,
          event.data_decoded.pool_balance_1,
          event.data_decoded.pool_balance_2,
          event.data_decoded.pool_balance_3,
        ].map((e, i) => scaleDown(e, decimals[i]));

        const tvlUsd = balances
          .map((balance, i) => balance.multipliedBy(actualCoinPrices[i]))
          .reduce((acc, e) => acc.plus(e), new BigDecimal(0));
        ctx.meter.Gauge("pool_tvl_usd").record(tvlUsd, { poolTag });

        ctx.meter.Counter("pool_volume_usd").add(volumeUsd, { poolTag });

        ctx.meter
          .Counter("pool_swap_fee_usd")
          .add(
            scaleDown(
              event.data_decoded.fee_amount,
              decimals[idxIn]
            ).multipliedBy(actualCoinInPrice),
            { poolTag }
          );
      }
    )
    .onEventWeightedPoolCreationEvent((event, ctx) => {
      const pool = `${
        weighted_pool.DEFAULT_OPTIONS.address
      }::weighted_pool::WeightedPool<${event.type_arguments
        .map((e) => e.trim())
        .join(", ")}>`;
      ctx.logger.info(`create pool ${pool}`, {
        pool,
        creator: ctx.transaction.sender,
        timestamp: ctx.transaction.timestamp,
      });
      ctx.logger.info("add liquidity", {
        pool,
        // TODO
        value: 0,
        maker: ctx.transaction.sender,
      });
    })
    .onEventAddLiquidityEvent((event, ctx) => {
      const pool = `${
        weighted_pool.DEFAULT_OPTIONS.address
      }::weighted_pool::WeightedPool<${event.type_arguments
        .map((e) => e.trim())
        .join(", ")}>`;
      ctx.logger.info("add liquidity", {
        pool,
        // TODO
        value: 0,
        maker: ctx.transaction.sender,
      });
    })
    .onEventRemoveLiquidityEvent((event, ctx) => {
      const pool = `${
        weighted_pool.DEFAULT_OPTIONS.address
      }::weighted_pool::WeightedPool<${event.type_arguments
        .map((e) => e.trim())
        .join(", ")}>`;
      ctx.logger.info("remove liquidity", {
        pool,
        // TODO
        value: 0,
        maker: ctx.transaction.sender,
      });
    });
}

// get the price of coin 1, 2, 3 quoted based on coin 0 from SwapEventInstance
// if any coin is Null, the price is undefined
function getPrices(
  event: weighted_pool.SwapEventInstance,
  coins: string[],
  weights: number[]
): {
  coin1Price: number;
  coin2Price: number | undefined;
  coin3Price: number | undefined;
} {
  const numCoins = coins.length;

  const balance0 = scaleDown(
    event.data_decoded.pool_balance_0,
    getCoinDecimals(coins[0])
  );
  const balance1 = scaleDown(
    event.data_decoded.pool_balance_1,
    getCoinDecimals(coins[1])
  );

  // https://docs.balancer.fi/v/v1/core-concepts/protocol/index#spot-price
  // price1 = (balance0 / balance1) * (weight1 / weight0)
  const coin1Price =
    (balance0.div(balance1).toNumber() * weights[1]) / weights[0];

  let coin2Price: number | undefined;
  let coin3Price: number | undefined;

  if (numCoins > 2) {
    const balance2 = scaleDown(
      event.data_decoded.pool_balance_2,
      getCoinDecimals(coins[2])
    );
    coin2Price = (balance0.div(balance2).toNumber() * weights[2]) / weights[0];
  }

  if (numCoins > 3) {
    const balance3 = scaleDown(
      event.data_decoded.pool_balance_3,
      getCoinDecimals(coins[2])
    );
    coin3Price = (balance0.div(balance3).toNumber() * weights[3]) / weights[0];
  }

  return {
    coin1Price,
    coin2Price,
    coin3Price,
  };
}

function getCoinsAndWeights(event: weighted_pool.SwapEventInstance): {
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

// use "WP-123456coin0Name-100000coin1Name-200000coin2Name-300000coin3Name-weight0-weight1-weight2-weight3" as unique tag for each pool
// the first 6 digits of coin address are used to reduce the length of the tag
function getPoolTag(coins: string[], weights: number[]): string {
  const concatCoins = coins
    .map((coin) => {
      const fragments = coin.split("::");
      return fragments[0].slice(2, 8) + fragments[fragments.length - 1];
    })
    .join("-");
  const concatWeights = weights.join("-");
  return `WP-${concatCoins}-${concatWeights}`;
}
