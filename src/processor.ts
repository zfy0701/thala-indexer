import { vault, stability_pool } from "./types/aptos/testnet/mod";

const START_VERSION = 340033099;

vault
  .bind({ startVersion: START_VERSION })
  .onEventBorrowEvent((event, ctx) => {
    ctx.meter.Counter("count_borrow").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter.Counter("cumulative_borrow_amount").add(event.data_typed.amount, {
      coin: event.type_arguments[0],
    });
    ctx.meter.Counter("cumulative_borrow_fee").add(event.data_typed.fee, {
      coin: event.type_arguments[0],
    });
  })
  .onEventRepayEvent((event, ctx) => {
    ctx.meter.Counter("count_repay").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter.Counter("cumulative_repay_amount").add(event.data_typed.amount, {
      coin: event.type_arguments[0],
    });
  })
  .onEventDepositEvent((event, ctx) => {
    ctx.meter.Counter("count_deposit_collateral").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter
      .Counter("cumulative_deposit_collateral_amount")
      .add(event.data_typed.amount, {
        coin: event.type_arguments[0],
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter.Counter("count_withdraw_collateral").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter
      .Counter("cumulative_withdraw_collateral_amount")
      .add(event.data_typed.amount, {
        coin: event.type_arguments[0],
      });
  });

stability_pool
  .bind({ startVersion: START_VERSION })
  .onEventDepositEvent((event, ctx) => {
    ctx.meter.Counter("count_deposit_stability").add(1, {
      account: ctx.transaction.sender,
    });
    ctx.meter.Counter("total_stability").add(event.data_typed.amount, {
      account: ctx.transaction.sender,
    });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter.Counter("count_withdraw_stability").add(1, {
      account: ctx.transaction.sender,
    });
    ctx.meter.Counter("total_stability").sub(event.data_typed.amount, {
      account: ctx.transaction.sender,
    });
  });
