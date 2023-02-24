import {
  scaleDown,
  getCoinDecimals,
  getPriceAsof,
  safeDiv,
  GALXE_QUESTS,
} from "../utils.js";

import { Gauge } from "@sentio/sdk";
import { stability_pool, vault } from "../types/aptos/testnet/mod.js";

const START_VERSION = 429533127;
const MOD_DECIMALS = 8;

const coinPriceGauge = Gauge.register("coin_price", { sparse: true });
const vaultUserTvlGauge = Gauge.register("vault_user_tvl", { sparse: true });

vault
  .bind({ startVersion: START_VERSION })
  .onEventBorrowEvent((event, ctx) => {
    ctx.eventLogger.emit(GALXE_QUESTS.BORROW_MOD, {
      distinctId: ctx.transaction.sender,
    });
    ctx.meter.Counter("count_borrow").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter
      .Counter("cumulative_borrow_amount")
      .add(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
        coin: event.type_arguments[0],
      });
    ctx.meter
      .Counter("cumulative_borrow_fee")
      .add(scaleDown(event.data_decoded.fee, MOD_DECIMALS), {
        coin: event.type_arguments[0],
      });
  })
  .onEventRepayEvent((event, ctx) => {
    ctx.meter.Counter("count_repay").add(1, {
      coin: event.type_arguments[0],
    });
    ctx.meter
      .Counter("cumulative_repay_amount")
      .add(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
        coin: event.type_arguments[0],
      });
  })
  .onEventDepositEvent((event, ctx) => {
    const coin = event.type_arguments[0];
    ctx.meter.Counter("count_deposit_collateral").add(1, {
      coin,
    });
    ctx.meter
      .Counter("cumulative_deposit_collateral_amount")
      .add(scaleDown(event.data_decoded.amount, getCoinDecimals(coin)), {
        coin,
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    const coin = event.type_arguments[0];
    ctx.meter.Counter("count_withdraw_collateral").add(1, {
      coin,
    });
    ctx.meter
      .Counter("cumulative_withdraw_collateral_amount")
      .add(scaleDown(event.data_decoded.amount, getCoinDecimals(coin)), {
        coin,
      });
  })
  .onEventVaultUpdatedEvent(async (event, ctx) => {
    let coinType = event.type_arguments[0];
    let price = await getPriceAsof(
      coinType,
      new Date(Number(ctx.transaction.timestamp) / 1000)
    );
    coinPriceGauge.record(ctx, price, { coin: coinType });

    // update vault tvl
    const vaultTvl = scaleDown(
      event.data_decoded.collateral,
      getCoinDecimals(coinType)
    ).multipliedBy(price);

    vaultUserTvlGauge.record(ctx, vaultTvl.toNumber(), {
      account: event.data_decoded.vault_address,
      coinType,
    });

    ctx.eventLogger.emit("update_vault", {
      version: event.version,
      account: event.data_decoded.vault_address,
      coinType,
      collateral: event.data_decoded.collateral,
      liability: event.data_decoded.liability,

      nicr: safeDiv(
        event.data_decoded.collateral,
        event.data_decoded.liability
      ),
    });
  });

stability_pool
  .bind({ startVersion: START_VERSION })
  .onEventDepositEvent((event, ctx) => {
    ctx.eventLogger.emit(GALXE_QUESTS.DEPOSIT_STABILITY_POOL, {
      distinctId: ctx.transaction.sender,
    });
    ctx.meter
      .Counter("total_stability")
      .add(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
        account: event.data_decoded.depositor,
      });
  })
  .onEventWithdrawEvent((event, ctx) => {
    ctx.meter
      .Counter("total_stability")
      .sub(scaleDown(event.data_decoded.amount, MOD_DECIMALS), {
        account: event.data_decoded.depositor,
      });
  });
