import { vault } from "./types/aptos/testnet/mod";

import { BigDecimal, Gauge } from "@sentio/sdk";
import { conversion } from "@sentio/sdk/lib/utils";
import { Exporter } from "@sentio/sdk/lib/core/exporter";
import { getPriceBySymbol, getPriceByType } from "@sentio/sdk/lib/utils/price";
import { APTOS_MAINNET_ID } from "@sentio/sdk/lib/utils/chain";

interface CoinInfo {
  address: string;
  decimals: number;
}

const START_VERSION = 345784333;
const MOD_DECIMALS = 8;

const COIN_INFO: { [key: string]: CoinInfo } = {
  "0x1::aptos_coin::AptosCoin": {
    address: "0x1::aptos_coin::AptosCoin",
    decimals: 8,
  },
  "0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1::BTC":
    {
      address:
        "0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1::BTC",
      decimals: 8,
    },
};

const exporter = Exporter.register("VaultUpdated", "UpdateSortedVaults");
const coinPriceGauge = Gauge.register("coin_price", { sparse: true });

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
    const coin = event.type_arguments[0];
    const coinInfo = COIN_INFO[coin];
    ctx.meter
      .Counter("cumulative_deposit_collateral_amount")
      .add(scaleDown(event.data_typed.amount, coinInfo.decimals), {
        coin,
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter.Counter("count_withdraw_collateral").add(1, {
      coin: event.type_arguments[0],
    });
    const coin = event.type_arguments[0];
    const coinInfo = COIN_INFO[coin];
    ctx.meter
      .Counter("cumulative_withdraw_collateral_amount")
      .add(scaleDown(event.data_typed.amount, coinInfo.decimals), {
        coin: event.type_arguments[0],
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
