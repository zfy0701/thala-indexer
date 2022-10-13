import { oracle } from "./types/aptos/mod";

oracle
  .bind({ ...oracle.DEFAULT_OPTIONS, startVersion: 277151455 })
  .onEntryUpdate((call, ctx) => {
    ctx.meter.Counter("count_update_oracle").add(1);
  });
