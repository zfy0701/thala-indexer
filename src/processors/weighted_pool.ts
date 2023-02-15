import { weighted_pool } from "../types/aptos/testnet/amm.js";
import { getCoinDecimals, scaleDown } from "../utils.js";

import { AptosContext } from "@sentio/sdk/aptos";
import { onEventSwapEvent } from "./base_pool.js";

const START_VERSION = 425585432;

const NULL_TYPE = `${weighted_pool.DEFAULT_OPTIONS.address}::base_pool::Null`;

weighted_pool
  .bind({ startVersion: START_VERSION })
  .onEventSwapEvent(
    async (event: weighted_pool.SwapEventInstance, ctx: AptosContext) => {
      const { coins, weights } = getCoinsAndWeights(event);
      const poolTag = getPoolTag(coins, weights);

      // relative prices
      const { coin1Price, coin2Price, coin3Price } = getPrices(
        event,
        coins,
        weights
      );

      const relativePrices = [1, coin1Price, coin2Price || 0, coin3Price || 0];

      await onEventSwapEvent(
        ctx,
        "weighted",
        coins,
        poolTag,
        relativePrices,
        event.data_decoded.idx_in,
        event.data_decoded.idx_out,
        event.data_decoded.amount_in,
        event.data_decoded.amount_out,
        event.data_decoded.fee_amount,
        event.data_decoded.pool_balance_0,
        event.data_decoded.pool_balance_1,
        event.data_decoded.pool_balance_2,
        event.data_decoded.pool_balance_3
      );
    }
  )
  .onEventWeightedPoolCreationEvent((event, ctx) => {
    const pool = `${
      weighted_pool.DEFAULT_OPTIONS.address
    }::weighted_pool::WeightedPool<${event.type_arguments
      .map((e) => e.trim())
      .join(", ")}>`;

    ctx.eventLogger.emit("create_pool", {
      pool,
      creator: ctx.transaction.sender,
      timestamp: ctx.transaction.timestamp,
    });
    ctx.eventLogger.emit("liquidity", {
      liquidityEventType: "Add",
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
    ctx.eventLogger.emit("liquidity", {
      liquidityEventType: "Add",
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
    ctx.eventLogger.emit("liquidity", {
      liquidityEventType: "Remove",
      pool,
      // TODO
      value: 0,
      maker: ctx.transaction.sender,
    });
  });

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
