import { farming, scripts } from "./types/aptos/farming.js";

const START_VERSION = 104592735;

farming
    .bind({ startVersion: START_VERSION })
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
