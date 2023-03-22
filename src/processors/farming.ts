import { farming, scripts } from "../types/aptos/farming.js";
import { GALXE_QUESTS } from "../utils.js";

const START_VERSION = 104592735;

farming
  .bind({ startVersion: START_VERSION })
  .onEventStakeEvent((event, ctx) => {
    if (
      event.data_decoded.stake_coin.includes("MOD") &&
      event.data_decoded.stake_coin.includes("USDC")
    ) {
      ctx.eventLogger.emit(GALXE_QUESTS.STAKE_MOD_USDC_LP, {
        distinctId: ctx.transaction.sender,
      });
    }
  })
  .onEventClaimEvent((event, ctx) => {
    ctx.eventLogger.emit("claim_reward", {
      distinctId: ctx.transaction.sender,
      amount: event.data_decoded.amount,
      stake_coin: event.data_decoded.stake_coin,
      reward_coin: event.data_decoded.reward_coin,
    });
  });

scripts.bind({ startVersion: START_VERSION }).onTransaction((tx, ctx) => {
  ctx.meter.Counter("total_txn").add(1, { type: "farming" });
});
