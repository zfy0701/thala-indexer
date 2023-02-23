import { lbp } from "../types/aptos/testnet/lbp.js";
import {
  fp64ToFloat,
  getCoinDecimals,
  getDateTag,
  scaleDown,
} from "../utils.js";

import { Gauge } from "@sentio/sdk";

const coin1PriceGauge = Gauge.register("price_coin_1", { sparse: true });

const START_VERSION = 426312400;

lbp
  .bind({ startVersion: START_VERSION })
  .onEventSwapEvent((event, ctx) => {
    const coin0 = event.type_arguments[0];
    const coin1 = event.type_arguments[1];
    const swapAmountIn = event.data_decoded.amount_in;
    const swapAmountOut = event.data_decoded.amount_out;
    const isBuy = event.data_decoded.is_buy;

    const dateString = getDateTag(Number(ctx.transaction.timestamp) / 1000);
    ctx.meter
      .Counter("volume_coin_0")
      .add(
        scaleDown(isBuy ? swapAmountIn : swapAmountOut, getCoinDecimals(coin0)),
        {
          poolId: getPoolId(event),
          dateString,
        }
      );
    const swapAttributes = {
      pair: `${coin0}-${coin1}`,
      is_buy: isBuy,
      creator_address: event.data_decoded.creator_addr,
      coin_address_in: coin0,
      coin_address_out: coin1,
      amount_in: swapAmountIn,
      amount_out: swapAmountOut,
      fee_amount: event.data_decoded.fee_amount,
    };

    ctx.eventLogger.emit("swap", {
      message: `Swap ${swapAmountIn} ${coin0} for ${swapAmountOut} ${coin1}`,
      ...swapAttributes,
    });
  })
  .onEventLiquidityEvent((event, ctx) => {
    const coin0 = event.type_arguments[0];
    const coin1 = event.type_arguments[1];
    coin1PriceGauge.record(ctx, getPriceFromEvent(event), {
      poolId: getPoolId(event),
    });

    // Track the amount of liquidity withdrawn - amount of liquidity provided for each coin
    // This helps to calculate token accrued and token released amount
    // coin0 accrued amount = sum(coin0 liquidity withdrawn) - sum(coin0 liquidity provided) + pool balance of coin0
    // coin1 released amount = sum(coin1 liquidity provided) - sum(coin1 liquidity withdrawn) - pool balance of coin1
    // and we define:
    // net_liqudity_withdrawn = sum(liquidity withdrawn) - sum(liquidity provided)
    ctx.meter
      .Counter("net_liquidity_withdrawn_0")
      .add(
        scaleDown(
          event.data_decoded.amount_0,
          getCoinDecimals(coin0)
        ).multipliedBy(event.data_decoded.is_add ? -1 : 1),
        {
          poolId: getPoolId(event),
        }
      );

    ctx.meter
      .Counter("net_liquidity_withdrawn_1")
      .add(
        scaleDown(
          event.data_decoded.amount_1,
          getCoinDecimals(coin1)
        ).multipliedBy(event.data_decoded.is_add ? -1 : 1),
        {
          poolId: getPoolId(event),
        }
      );

    // Track total liquidity provided by owner
    if (event.data_decoded.is_add) {
      ctx.meter
        .Counter("total_liquidity_provided_1")
        .add(scaleDown(event.data_decoded.amount_1, getCoinDecimals(coin1)), {
          poolId: getPoolId(event),
        });
    }
  })
  .onEventSwapEvent((event, ctx) => {
    coin1PriceGauge.record(ctx, getPriceFromEvent(event), {
      poolId: getPoolId(event),
    });
  });

// get the price of coin 1 quoted based on coin 0
function getPriceFromEvent(
  event: lbp.LiquidityEventInstance | lbp.SwapEventInstance
) {
  const coin0 = event.type_arguments[0];
  const coin1 = event.type_arguments[1];
  const weight0 = fp64ToFloat(event.data_decoded.weight_0.v);
  const weight1 = fp64ToFloat(event.data_decoded.weight_1.v);
  const balance0 = scaleDown(
    event.data_decoded.balance_0,
    getCoinDecimals(coin0)
  );
  const balance1 = scaleDown(
    event.data_decoded.balance_1,
    getCoinDecimals(coin1)
  );

  // https://docs.balancer.fi/v/v1/core-concepts/protocol/index#spot-price
  // price1 = (balance0 / balance1) * (weight1 / weight0)
  return (balance0.div(balance1).toNumber() * weight1) / weight0;
}

function getPoolId(event: lbp.LiquidityEventInstance | lbp.SwapEventInstance) {
  return [
    event.data_decoded.creator_addr,
    event.type_arguments[0],
    event.type_arguments[1],
  ].join("_");
}
