import { lbp } from "../types/aptos/testnet/lbp";
import { fp64ToFloat, getCoinDecimals, scaleDown } from "../utils";

import { Gauge } from "@sentio/sdk";

const coin1PriceGauge = Gauge.register("price_coin_1", { sparse: true });

const START_VERSION = 369883229;

export function processor() {
  lbp
    .bind({ startVersion: START_VERSION })
    .onEventSwapEvent((event, ctx) => {
      const coin0 = event.type_arguments[0];
      const poolId = event.data_typed.pool_id;
      ctx.meter
        .Counter("volume_coin_0")
        .add(scaleDown(event.data_typed.amount_0, getCoinDecimals(coin0)), {
          poolId,
        });
    })
    .onEventLiquidityEvent((event, ctx) => {
      const coin0 = event.type_arguments[0];
      const coin1 = event.type_arguments[1];
      const poolId = event.data_typed.pool_id;
      coin1PriceGauge.record(ctx, getPriceFromEvent(event), {
        poolId,
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
            event.data_typed.amount_0,
            getCoinDecimals(coin0)
          ).multipliedBy(event.data_typed.is_add ? -1 : 1),
          {
            poolId,
          }
        );

      ctx.meter
        .Counter("net_liquidity_withdrawn_1")
        .add(
          scaleDown(
            event.data_typed.amount_1,
            getCoinDecimals(coin1)
          ).multipliedBy(event.data_typed.is_add ? -1 : 1),
          {
            poolId,
          }
        );

      // Track total liquidity provided by owner
      if (event.data_typed.is_add) {
        ctx.meter
          .Counter("total_liquidity_provided_1")
          .add(scaleDown(event.data_typed.amount_1, getCoinDecimals(coin1)), {
            poolId,
          });
      }
    })
    .onEventSwapEvent((event, ctx) => {
      coin1PriceGauge.record(ctx, getPriceFromEvent(event), {
        poolId: event.data_typed.pool_id,
      });
    });
}

// get the price of coin 1 quoted based on coin 0
function getPriceFromEvent(
  event: lbp.LiquidityEventInstance | lbp.SwapEventInstance
) {
  const coin0 = event.type_arguments[0];
  const coin1 = event.type_arguments[1];
  const weight0 = fp64ToFloat(event.data_typed.weight_0.v);
  const weight1 = fp64ToFloat(event.data_typed.weight_1.v);
  const balance0 = scaleDown(
    event.data_typed.balance_0,
    getCoinDecimals(coin0)
  );
  const balance1 = scaleDown(
    event.data_typed.balance_0,
    getCoinDecimals(coin1)
  );

  // https://docs.balancer.fi/v/v1/core-concepts/protocol/index#spot-price
  // price1 = (balance0 / balance1) * (weight1 / weight0)
  return (balance0.div(balance1).toNumber() * weight1) / weight0;
}
