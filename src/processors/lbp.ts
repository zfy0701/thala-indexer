import { lbp, lbp_scripts } from "../types/aptos/lbp.js";
import {
  fp64ToFloat,
  getCoinDecimals,
  getPriceAsof,
  scaleDown,
} from "../utils.js";

import { Gauge } from "@sentio/sdk";

const coin1PriceGauge = Gauge.register("price_coin_1", { sparse: true });

const START_VERSION = 107983306;

lbp
  .bind({ startVersion: START_VERSION })
  .onEventSwapEvent(async (event, ctx) => {
    const coin0 = event.type_arguments[0];
    const coin1 = event.type_arguments[1];
    const swapAmountIn = event.data_decoded.amount_in;
    const swapAmountOut = event.data_decoded.amount_out;
    const isBuy = event.data_decoded.is_buy;

    ctx.meter
      .Counter("volume_coin_0")
      .add(
        scaleDown(isBuy ? swapAmountIn : swapAmountOut, getCoinDecimals(coin0)),
        {
          poolId: getPoolId(event),
        }
      );

    const price1To0 = getPriceFromEvent(event);
    const price0Usd = await getPriceAsof(
      coin0,
      new Date(Number(ctx.transaction.timestamp) / 1000)
    );
    const price1Usd = price0Usd * price1To0;

    const swapAttributes = {
      pair: `${coin0}-${coin1}`,
      is_buy: isBuy,
      creator_address: event.data_decoded.creator_addr,
      coin_address_in: isBuy ? coin0 : coin1,
      coin_address_out: isBuy ? coin1 : coin0,
      amount_in: swapAmountIn,
      amount_out: swapAmountOut,
      fee_amount: event.data_decoded.fee_amount,
      price_in: isBuy ? price0Usd : price1Usd,
      price_out: isBuy ? price1Usd : price0Usd,
    };

    coin1PriceGauge.record(ctx, price1Usd, {
      poolId: getPoolId(event),
    });

    ctx.eventLogger.emit("swap", {
      distinctId: ctx.transaction.sender,
      message: `Swap ${swapAmountIn} ${coin0} for ${swapAmountOut} ${coin1}`,
      ...swapAttributes,
    });
  });

lbp_scripts.bind({ startVersion: START_VERSION }).onTransaction((tx, ctx) => {
  ctx.meter.Counter("total_txn").add(1, { type: "lbp" });
});

// get the price of coin 1 quoted based on coin 0
function getPriceFromEvent(event: lbp.SwapEventInstance) {
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

function getPoolId(event: lbp.SwapEventInstance) {
  return [
    event.data_decoded.creator_addr,
    event.type_arguments[0],
    event.type_arguments[1],
  ].join("_");
}
