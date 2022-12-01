import { lbp } from "../types/aptos/testnet/lbp";
import { getCoinDecimals, scaleDown } from "../utils";

const START_VERSION = 369883229;

export function processor() {
  lbp.bind({ startVersion: START_VERSION }).onEventSwapEvent((event, ctx) => {
    const coin0 = event.type_arguments[0];
    const poolId = event.data_typed.pool_id;
    ctx.meter
      .Counter("volume_coin_0")
      .add(scaleDown(event.data_typed.amount_0, getCoinDecimals(coin0)), {
        poolId,
      });
  });
}
