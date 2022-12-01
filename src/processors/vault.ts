import { vault } from "../types/aptos/testnet/mod";
import { scaleDown, getCoinDecimals } from "../utils";

import { Gauge } from "@sentio/sdk";
import { Exporter } from "@sentio/sdk/lib/core/exporter";
import { getPriceBySymbol, getPriceByType } from "@sentio/sdk/lib/utils/price";
import { APTOS_MAINNET_ID } from "@sentio/sdk/lib/utils/chain";

const START_VERSION = 345784333;
const MOD_DECIMALS = 8;

const exporter = Exporter.register("VaultUpdated", "UpdateSortedVaults");
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
        .add(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
          coin: event.type_arguments[0],
        });
      ctx.meter
        .Counter("cumulative_borrow_fee")
        .add(scaleDown(event.data_typed.fee, MOD_DECIMALS), {
          coin: event.type_arguments[0],
        });
    })
    .onEventRepayEvent((event, ctx) => {
      ctx.meter.Counter("count_repay").add(1, {
        coin: event.type_arguments[0],
      });
      ctx.meter
        .Counter("cumulative_repay_amount")
        .add(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
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
        .add(scaleDown(event.data_typed.amount, getCoinDecimals(coin)), {
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
        .add(scaleDown(event.data_typed.amount, getCoinDecimals(coin)), {
          coin,
        });
    })
    .onEventVaultUpdatedEvent(async (event, ctx) => {
      let coinType = event.type_arguments[0];
      let price = 0;
      if (
        coinType ===
        "0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1::BTC"
      ) {
        price = await getPriceBySymbol(
          "BTC",
          new Date(Number(ctx.transaction.timestamp) / 1000)
        );
      } else {
        price = await getPriceByType(
          // use mainnet price is fine
          APTOS_MAINNET_ID,
          coinType,
          new Date(Number(ctx.transaction.timestamp) / 1000)
        );
      }

      coinPriceGauge.record(ctx, price, { coin: coinType });

      const data = {
        version: event.version,
        account: event.data_typed.vault_addr,
        coinType,
        collateral: event.data_typed.collateral,
        debt: event.data_typed.debt,
      };
      exporter.emit(ctx, data);
    });
}
