import { farming } from "../types/aptos/testnet/farming.js";
import { GALXE_QUESTS } from "../utils.js";

const START_VERSION = 431178000;

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
  });
