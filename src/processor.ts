import { vault, stability_pool } from "./types/aptos/testnet/mod";

import { CoinListClient } from "@manahippo/coin-list";
import { BigDecimal } from "@sentio/sdk";
import { conversion } from "@sentio/sdk/lib/utils";

const START_VERSION = 344228659;
const MOD_DECIMALS = 8;

const coinListClient = new CoinListClient("testnet");

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
      .add(event.data_typed.amount / BigInt(10 ** coin.decimals), {
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
      .add(event.data_typed.amount / BigInt(10 ** coin.decimals), {
        coin: event.type_arguments[0],
      });
  });

stability_pool
  .bind({ startVersion: START_VERSION })
  .onEventDepositEvent((event, ctx) => {
    ctx.meter.Counter("count_deposit_stability").add(1, {
      account: ctx.transaction.sender,
    });
    ctx.meter
      .Counter("total_stability")
      .add(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
        account: ctx.transaction.sender,
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter.Counter("count_withdraw_stability").add(1, {
      account: ctx.transaction.sender,
    });
    ctx.meter
      .Counter("total_stability")
      .sub(scaleDown(event.data_typed.amount, MOD_DECIMALS), {
        account: ctx.transaction.sender,
      });
  });

function scaleDown(n: bigint, decimals: number): BigDecimal {
  return conversion.toBigDecimal(n).dividedBy(10 ** decimals);
}
