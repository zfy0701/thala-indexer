import { scaleDown, getCoinDecimals, getPriceAsof } from "../utils";

import { Gauge } from "@sentio/sdk";
// import { Exporter } from "@sentio/sdk/lib/core/exporter";
import { stability_pool, vault } from "../types/aptos/testnet/mod";

// https://explorer.aptoslabs.com/txn/418965101?network=testnet
const START_VERSION = 418965101;
const MOD_DECIMALS = 8;

// const exporter = Exporter.register("VaultUpdated", "UpdateSortedVaults");
const coinPriceGauge = Gauge.register("coin_price", { sparse: true });

export function processor() {
  vault
    .bind({ startVersion: START_VERSION })
    .onEventBorrowEvent((event, ctx) => {
      ctx.meter.Counter("count_borrow").add(1, {
        coin: event.type_arguments[0],
      });
      ctx.meter
        .Counter("cumulative_borrow_amount")
        .add(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
          coin: event.type_arguments[0],
        });
      ctx.meter
        .Counter("cumulative_borrow_fee")
        .add(scaleDown(event.data_decoded.fee, MOD_DECIMALS), {
          coin: event.type_arguments[0],
        });
    })
    .onEventRepayEvent((event, ctx) => {
      ctx.meter.Counter("count_repay").add(1, {
        coin: event.type_arguments[0],
      });
      ctx.meter
        .Counter("cumulative_repay_amount")
        .add(scaleDown(event.data_decoded.debt_amount, MOD_DECIMALS), {
          coin: event.type_arguments[0],
        });
    })
    .onEventDepositEvent((event, ctx) => {
      const coin = event.type_arguments[0];
      ctx.meter.Counter("count_deposit_collateral").add(1, {
        coin,
      });
      ctx.meter
        .Counter("cumulative_deposit_collateral_amount")
        .add(scaleDown(event.data_decoded.amount, getCoinDecimals(coin)), {
          coin,
        });
    })
    .onEventWithdrawEvent((event, ctx) => {
      const coin = event.type_arguments[0];
      ctx.meter.Counter("count_withdraw_collateral").add(1, {
        coin,
      });
      ctx.meter
        .Counter("cumulative_withdraw_collateral_amount")
        .add(scaleDown(event.data_decoded.amount, getCoinDecimals(coin)), {
          coin,
        });
    })
    .onEventVaultUpdatedEvent(async (event, ctx) => {
      let coinType = event.type_arguments[0];
      let price = await getPriceAsof(
        coinType,
        new Date(Number(ctx.transaction.timestamp) / 1000)
      );
      coinPriceGauge.record(ctx, price, { coin: coinType });

      //   const data = {
      //     version: event.version,
      //     account: event.data_decoded.vault_address,
      //     coinType,
      //     collateral: event.data_decoded.collateral,
      //     debt: event.data_decoded.debt,
      //   };
      //   exporter.emit(ctx, data);
    });

  stability_pool
    .bind({ startVersion: START_VERSION })
    .onEventDepositEvent((event, ctx) => {
      ctx.meter
        .Counter("total_stability")
        .add(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
          account: event.data_decoded.depositor,
        });
    })
    .onEventWithdrawEvent((event, ctx) => {
      ctx.meter
        .Counter("total_stability")
        .sub(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
          account: event.data_decoded.depositor,
        });
    });
}
