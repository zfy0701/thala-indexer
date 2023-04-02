import { Counter } from "@sentio/sdk";
import { coin } from "@sentio/sdk/aptos/builtin/0x1";
import { getDepositCoinType, getWithDrawCoinType } from "@sentio/sdk/aptos/ext";
import { AptosContext, Event, Transaction_UserTransaction } from '@sentio/sdk/aptos'
import { Types } from 'aptos-sdk'

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
    // const coinType = getDepositCoinType(event, ctx.transaction);
    // if (coinType !== THL) return;
    // const increment = event.data_decoded.amount.scaleDown(THL_DECIMALS);
    // balance.add(ctx, increment, { user: event.guid.account_address });
    updateBalance(event, ctx)
  }, {resourceChanges: true})
  .onEventWithdrawEvent((event, ctx) => {
    // const coinType = getWithDrawCoinType(event, ctx.transaction);
    // if (coinType !== THL) return;
    // const decrement = event.data_decoded.amount.scaleDown(THL_DECIMALS);
    // balance.sub(ctx, decrement, { user: event.guid.account_address });
    updateBalance(event, ctx)
  }, {resourceChanges: true});

function updateBalance(event: Event, ctx: AptosContext) {
  const balance = findNewCoinBalances(event, ctx.transaction, THL)
  if (balance !== undefined) {
    ctx.eventLogger.emit("BalanceChange", {
      distinctId: event.guid.account_address,
      balance: balance.scaleDown(THL_DECIMALS)
    })
  }
}


export function findNewCoinBalances(evt: Event, tx: Transaction_UserTransaction, coin: string): BigInt | undefined {
  if (!tx.changes) {
    throw Error('No resource change found, did you forget set fetchOption to { resourceChanges: true  } ')
  }
  for (const change of tx.changes) {
    if (change.type !== 'write_resource') {
      continue
    }
    const writeResource = change as Types.WriteSetChange_WriteResource
    if (writeResource.address !== evt.guid.account_address) {
      continue
    }
    if (writeResource.data.type !== `0x1::coin::CoinStore<${coin}>`) {
      continue
    }
    const value = BigInt((writeResource.data.data as any).coin.value)
    return value
  }
  return undefined
}
