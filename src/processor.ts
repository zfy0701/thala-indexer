import { oracle, vault } from "./types/aptos/mod";

oracle
  .bind({ startVersion: 277151455 })
  .onEntryUpdate((call, ctx) => {
    ctx.meter.Counter("count_update_oracle").add(1);
  });

vault
  .bind({ startVersion: 278887758 })
  .onEventBorrowEvent((event, ctx) => {
    ctx.meter.Counter("count_borrow").add(1);
    ctx.meter
      .Counter("cumulative_borrow_amount")
      .add(event.data_typed.amount);
    ctx.meter
      .Counter("cumulative_borrow_fee")
      .add(event.data_typed.fee);
  });
