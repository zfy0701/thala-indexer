import { Counter } from "@sentio/sdk";
import { coin } from "@sentio/sdk/aptos/builtin/0x1";
import { getDepositCoinType, getWithDrawCoinType } from "@sentio/sdk/aptos/ext";

const THL =
  "0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL";
const THL_DECIMALS = 8;
// this is when THL is first minted from manager account
// https://explorer.aptoslabs.com/txn/111028289
const START_VERSION = 111028289;

const balance = Counter.register("balance");

coin
  .bind({
    startVersion: START_VERSION,
  })
  .onEventDepositEvent((event, ctx) => {
    const coinType = getDepositCoinType(event, ctx.transaction);
    if (coinType !== THL) return;
    const increment = event.data_decoded.amount.scaleDown(THL_DECIMALS);
    balance.add(ctx, increment, { user: event.guid.account_address });
  }, {resourceChanges: true})
  .onEventWithdrawEvent((event, ctx) => {
    const coinType = getWithDrawCoinType(event, ctx.transaction);
    if (coinType !== THL) return;
    const decrement = event.data_decoded.amount.scaleDown(THL_DECIMALS);
    balance.sub(ctx, decrement, { user: event.guid.account_address });
  }, {resourceChanges: true});
