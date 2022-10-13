import { oracle, vault } from "./types/aptos/mod";

oracle
  .bind({ ...oracle.DEFAULT_OPTIONS, startVersion: 277151455 })
  .onEntryUpdate((call, ctx) => {
    ctx.meter.Counter("count_update_oracle").add(1);
  });

vault
  .bind({ ...vault.DEFAULT_OPTIONS, startVersion: 278887758 })
  .onEventBorrowEvent((event, ctx) => {
    ctx.meter.Counter("count_borrow").add(1);
    ctx.meter
      .Counter("cumulative_borrow_amount")
      .add(Number(event.data.amount) / 10 ** 8);
    ctx.meter
      .Counter("cumulative_borrow_fee")
      .add(Number(event.data.fee) / 10 ** 8);
  });
