import { oracle, vault } from "./types/aptos/mod";

const START_VERSION = 283621865;

oracle.bind({ startVersion: START_VERSION }).onEntryUpdate((call, ctx) => {
  ctx.meter.Counter("count_update_oracle").add(1);
});

vault.bind({ startVersion: START_VERSION }).onEventBorrowEvent((event, ctx) => {
  ctx.meter.Counter("count_borrow").add(1);
  ctx.meter
    .Counter("cumulative_borrow_amount")
    .add(event.data_typed.amount, {
      coin: event.type_arguments[0],
      // borrower: ctx.transaction.sender,
    });
  ctx.meter
    .Counter("cumulative_borrow_fee")
    .add(event.data_typed.fee, {
      coin: event.type_arguments[0],
      // borrower: ctx.transaction.sender,
    });
});
