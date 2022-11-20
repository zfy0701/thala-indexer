import { vault } from "./types/aptos/testnet/mod";

import { CoinListClient } from "@manahippo/coin-list";
import { BigDecimal, Gauge } from "@sentio/sdk";
import { conversion } from "@sentio/sdk/lib/utils";
import { Exporter } from "@sentio/sdk/lib/core/exporter";
import { getPriceByType } from "@sentio/sdk/lib/utils/price";
import { APTOS_MAINNET_ID } from "@sentio/sdk/lib/utils/chain";

const START_VERSION = 345784333;
const MOD_DECIMALS = 8;

const coinListClient = new CoinListClient("testnet");
const exporter = Exporter.register("VaultUpdated", "UpdateSortedVaultsV2");
const coinPriceGauge = new Gauge("coin_price", { sparse: true });

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
    ctx.meter.Counter("count_deposit_collateral").add(1, {
      coin: event.type_arguments[0],
    });
    const coin = coinListClient.getCoinInfoByFullName(event.type_arguments[0])!;
    ctx.meter
      .Counter("cumulative_deposit_collateral_amount")
      .add(scaleDown(event.data_typed.amount, coin.decimals), {
        coin: coin.token_type.type,
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter.Counter("count_withdraw_collateral").add(1, {
      coin: event.type_arguments[0],
    });
    const coin = coinListClient.getCoinInfoByFullName(event.type_arguments[0])!;
    ctx.meter
      .Counter("cumulative_withdraw_collateral_amount")
      .add(scaleDown(event.data_typed.amount, coin.decimals), {
        coin: event.type_arguments[0],
      });
  })
  .onEventVaultUpdatedEvent(async (event, ctx) => {
    // a hack to bypass zero values, gonna remove this on later sdk release
    if (coinPriceGauge.usage === 0) {
      coinPriceGauge.record(ctx, 0, { coin: "na" });
    }
    let coinType = event.type_arguments[0];
    let price = await getPriceByType(
      // use mainnet price is fine
      APTOS_MAINNET_ID,
      coinType,
      new Date(Number(ctx.transaction.timestamp) / 1000)
    );

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

// stability_pool
//   .bind({ startVersion: START_VERSION })
//   .onEventDepositEvent((event, ctx) => {
//     ctx.meter.Counter("count_deposit_stability").add(1, {
//       account: ctx.transaction.sender,
//     });
//     ctx.meter
//       .Counter("total_stability")
//       .add(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
//         account: ctx.transaction.sender,
//       });
//   })
//   .onEventWithdrawEvent((event, ctx) => {
//     ctx.meter.Counter("count_withdraw_stability").add(1, {
//       account: ctx.transaction.sender,
//     });
//     ctx.meter
//       .Counter("total_stability")
//       .sub(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
//         account: ctx.transaction.sender,
//       });
//   });

function scaleDown(n: bigint, decimals: number): BigDecimal {
  return conversion.toBigDecimal(n).dividedBy(10 ** decimals);
}
