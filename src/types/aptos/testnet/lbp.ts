/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

/* Generated modules for account 0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04 */

import {
  TypeRegistry,
  AptosBindOptions,
  AptosBaseProcessor,
  TypedEventInstance,
  AptosNetwork,
  TypedEntryFunctionPayload,
  AptosContext,
  CallFilter,
} from "@sentio/sdk-aptos";
import { AptosFetchConfig } from "@sentio/protos";
import { Address, MoveModule } from "aptos-sdk/src/generated";

import * as _0x1 from "@sentio/sdk-aptos/lib/builtin/0x1";
import * as _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87 from "./0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87";

export class lbp extends AptosBaseProcessor {
  constructor(options: AptosBindOptions) {
    super("lbp", options);
  }
  static DEFAULT_OPTIONS: AptosBindOptions = {
    address:
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04",
    network: AptosNetwork.TEST_NET,
  };

  static bind(options: Partial<AptosBindOptions> = {}): lbp {
    return new lbp({ ...lbp.DEFAULT_OPTIONS, ...options });
  }

  onEntryGrantWhitelist(
    func: (call: lbp.GrantWhitelistPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::grant_whitelist",
      },
      fetchConfig
    );
    return this;
  }

  onEntryRevokeWhitelist(
    func: (call: lbp.RevokeWhitelistPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::revoke_whitelist",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetEnabled(
    func: (call: lbp.SetEnabledPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::set_enabled",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetMaxDurationSeconds(
    func: (call: lbp.SetMaxDurationSecondsPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::set_max_duration_seconds",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetMaxSwapFeeBps(
    func: (call: lbp.SetMaxSwapFeeBpsPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::set_max_swap_fee_bps",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetProtocolSwapFeePct(
    func: (call: lbp.SetProtocolSwapFeePctPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::set_protocol_swap_fee_pct",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetWeightSchedule(
    func: (call: lbp.SetWeightSchedulePayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp::set_weight_schedule",
      },
      fetchConfig
    );
    return this;
  }

  onEventWhitelistEvent(
    func: (event: lbp.WhitelistEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::WhitelistEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventSetEnabledEvent(
    func: (event: lbp.SetEnabledEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::SetEnabledEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventSetWeightScheduleEvent(
    func: (
      event: lbp.SetWeightScheduleEventInstance,
      ctx: AptosContext
    ) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::SetWeightScheduleEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventPoolCreationEvent(
    func: (event: lbp.PoolCreationEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::PoolCreationEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventLiquidityEvent(
    func: (event: lbp.LiquidityEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::LiquidityEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventSwapEvent(
    func: (event: lbp.SwapEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::SwapEvent",
      },
      fetchConfig
    );
    return this;
  }

  onEventLBPParamChangeEvent(
    func: (event: lbp.LBPParamChangeEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): lbp {
    this.onEvent(
      func,
      {
        type: "lbp::LBPParamChangeEvent",
      },
      fetchConfig
    );
    return this;
  }

  loadTypesInternal(registry: TypeRegistry) {
    loadAllTypes(registry);
  }
}

export namespace lbp {
  export class CreatorWhitelist {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::CreatorWhitelist";
    ids: _0x1.table.Table<string, Boolean>;
  }

  export class LBP<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBP";
    asset_0: _0x1.coin.Coin<T0>;
    asset_1: _0x1.coin.Coin<T1>;
    start_weight_0: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    start_weight_1: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    end_weight_0: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    end_weight_1: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    swap_fee_bps: bigint;
    start_timestamp_seconds: bigint;
    end_timestamp_seconds: bigint;
    asset_0_tax_free_amount: bigint;
    enabled: Boolean;
    creator: Address;
  }

  export class LBPAccountCapability {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBPAccountCapability";
    signer_cap: _0x1.account.SignerCapability;
  }

  export class LBPEvents<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBPEvents";
    whitelist_events: _0x1.event.EventHandle<lbp.WhitelistEvent<T0, T1>>;
    set_enabled_events: _0x1.event.EventHandle<lbp.SetEnabledEvent<T0, T1>>;
    set_weight_schedule_events: _0x1.event.EventHandle<
      lbp.SetWeightScheduleEvent<T0, T1>
    >;
    pool_creation_events: _0x1.event.EventHandle<lbp.PoolCreationEvent<T0, T1>>;
    liquidity_events: _0x1.event.EventHandle<lbp.LiquidityEvent<T0, T1>>;
    swap_events: _0x1.event.EventHandle<lbp.SwapEvent<T0, T1>>;
  }

  export class LBPParamChangeEvent {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBPParamChangeEvent";
    name: string;
    prev_value: bigint;
    new_value: bigint;
  }

  export interface LBPParamChangeEventInstance
    extends TypedEventInstance<LBPParamChangeEvent> {
    data_typed: LBPParamChangeEvent;
    type_arguments: [];
  }

  export class LBPParams {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBPParams";
    max_duration_seconds: bigint;
    max_swap_fee_bps: bigint;
    protocol_swap_fee_pct: bigint;
    param_change_events: _0x1.event.EventHandle<lbp.LBPParamChangeEvent>;
  }

  export class LiquidityEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LiquidityEvent";
    is_add: Boolean;
    amount_0: bigint;
    amount_1: bigint;
    balance_0: bigint;
    balance_1: bigint;
    weight_0: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    weight_1: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    pool_id: string;
  }

  export interface LiquidityEventInstance
    extends TypedEventInstance<LiquidityEvent<any, any>> {
    data_typed: LiquidityEvent<any, any>;
    type_arguments: [string, string];
  }

  export class PoolCollection<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::PoolCollection";
    pools: _0x1.table.Table<string, lbp.LBP<T0, T1>>;
  }

  export class PoolCreationEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::PoolCreationEvent";
    start_weight_0: bigint;
    end_weight_0: bigint;
    start_timestamp_seconds: bigint;
    end_timestamp_seconds: bigint;
    swap_fee_bps: bigint;
    enabled: Boolean;
    pool_id: string;
  }

  export interface PoolCreationEventInstance
    extends TypedEventInstance<PoolCreationEvent<any, any>> {
    data_typed: PoolCreationEvent<any, any>;
    type_arguments: [string, string];
  }

  export class SetEnabledEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SetEnabledEvent";
    enabled: Boolean;
    pool_id: string;
  }

  export interface SetEnabledEventInstance
    extends TypedEventInstance<SetEnabledEvent<any, any>> {
    data_typed: SetEnabledEvent<any, any>;
    type_arguments: [string, string];
  }

  export class SetWeightScheduleEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SetWeightScheduleEvent";
    start_weight_0: bigint;
    end_weight_0: bigint;
    start_timestamp_seconds: bigint;
    end_timestamp_seconds: bigint;
    pool_id: string;
  }

  export interface SetWeightScheduleEventInstance
    extends TypedEventInstance<SetWeightScheduleEvent<any, any>> {
    data_typed: SetWeightScheduleEvent<any, any>;
    type_arguments: [string, string];
  }

  export class SwapEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SwapEvent";
    is_buy: Boolean;
    amount_0: bigint;
    amount_1: bigint;
    balance_0: bigint;
    balance_1: bigint;
    weight_0: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    weight_1: _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.fixed_point64.FixedPoint64;
    pool_id: string;
  }

  export interface SwapEventInstance
    extends TypedEventInstance<SwapEvent<any, any>> {
    data_typed: SwapEvent<any, any>;
    type_arguments: [string, string];
  }

  export class WhitelistEvent<T0, T1> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::WhitelistEvent";
    whitelisted: Boolean;
    pool_id: string;
    pool_creator: Address;
  }

  export interface WhitelistEventInstance
    extends TypedEventInstance<WhitelistEvent<any, any>> {
    data_typed: WhitelistEvent<any, any>;
    type_arguments: [string, string];
  }

  export interface GrantWhitelistPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[Address]> {
    arguments_typed: [Address];
    type_arguments: [string, string];
  }

  export interface RevokeWhitelistPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[Address]> {
    arguments_typed: [Address];
    type_arguments: [string, string];
  }

  export interface SetEnabledPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[Boolean]> {
    arguments_typed: [Boolean];
    type_arguments: [string, string];
  }

  export interface SetMaxDurationSecondsPayload
    extends TypedEntryFunctionPayload<[bigint]> {
    arguments_typed: [bigint];
    type_arguments: [];
  }

  export interface SetMaxSwapFeeBpsPayload
    extends TypedEntryFunctionPayload<[bigint]> {
    arguments_typed: [bigint];
    type_arguments: [];
  }

  export interface SetProtocolSwapFeePctPayload
    extends TypedEntryFunctionPayload<[bigint]> {
    arguments_typed: [bigint];
    type_arguments: [];
  }

  export interface SetWeightSchedulePayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[bigint, bigint, bigint, bigint]> {
    arguments_typed: [bigint, bigint, bigint, bigint];
    type_arguments: [string, string];
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"lbp","friends":["0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::init"],"exposed_functions":[{"name":"add_liquidity","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"],"return":["0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"]},{"name":"create_lbp","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","0x1::coin::Coin<T0>","0x1::coin::Coin<T1>","u64","u64","u64","u64","u64","bool"],"return":[]},{"name":"grant_whitelist","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","address"],"return":[]},{"name":"initialize","visibility":"friend","is_entry":false,"generic_type_params":[],"params":["&signer"],"return":[]},{"name":"initialized","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["bool"]},{"name":"remove_liquidity","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","u64"],"return":["0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"]},{"name":"revoke_whitelist","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","address"],"return":[]},{"name":"set_enabled","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","bool"],"return":[]},{"name":"set_max_duration_seconds","visibility":"public","is_entry":true,"generic_type_params":[],"params":["&signer","u64"],"return":[]},{"name":"set_max_swap_fee_bps","visibility":"public","is_entry":true,"generic_type_params":[],"params":["&signer","u64"],"return":[]},{"name":"set_protocol_swap_fee_pct","visibility":"public","is_entry":true,"generic_type_params":[],"params":["&signer","u64"],"return":[]},{"name":"set_weight_schedule","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","u64","u64","u64","u64"],"return":[]},{"name":"swap_exact_in","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["vector<u8>","0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"],"return":["0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"]},{"name":"swap_exact_out","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["vector<u8>","0x1::coin::Coin<T0>","0x1::coin::Coin<T1>","u64","u64"],"return":["0x1::coin::Coin<T0>","0x1::coin::Coin<T1>"]}],"structs":[{"name":"CreatorWhitelist","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"ids","type":"0x1::table::Table<vector<u8>, bool>"}]},{"name":"LBP","is_native":false,"abilities":["store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"asset_0","type":"0x1::coin::Coin<T0>"},{"name":"asset_1","type":"0x1::coin::Coin<T1>"},{"name":"start_weight_0","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"start_weight_1","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"end_weight_0","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"end_weight_1","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"swap_fee_bps","type":"u64"},{"name":"start_timestamp_seconds","type":"u64"},{"name":"end_timestamp_seconds","type":"u64"},{"name":"asset_0_tax_free_amount","type":"u64"},{"name":"enabled","type":"bool"},{"name":"creator","type":"address"}]},{"name":"LBPAccountCapability","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"signer_cap","type":"0x1::account::SignerCapability"}]},{"name":"LBPEvents","is_native":false,"abilities":["key"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"whitelist_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::WhitelistEvent<T0, T1>>"},{"name":"set_enabled_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SetEnabledEvent<T0, T1>>"},{"name":"set_weight_schedule_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SetWeightScheduleEvent<T0, T1>>"},{"name":"pool_creation_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::PoolCreationEvent<T0, T1>>"},{"name":"liquidity_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LiquidityEvent<T0, T1>>"},{"name":"swap_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::SwapEvent<T0, T1>>"}]},{"name":"LBPParamChangeEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[],"fields":[{"name":"name","type":"0x1::string::String"},{"name":"prev_value","type":"u64"},{"name":"new_value","type":"u64"}]},{"name":"LBPParams","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"max_duration_seconds","type":"u64"},{"name":"max_swap_fee_bps","type":"u64"},{"name":"protocol_swap_fee_pct","type":"u64"},{"name":"param_change_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBPParamChangeEvent>"}]},{"name":"LiquidityEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"is_add","type":"bool"},{"name":"amount_0","type":"u64"},{"name":"amount_1","type":"u64"},{"name":"balance_0","type":"u64"},{"name":"balance_1","type":"u64"},{"name":"weight_0","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"weight_1","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"pool_id","type":"vector<u8>"}]},{"name":"PoolCollection","is_native":false,"abilities":["key"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"pools","type":"0x1::table::Table<vector<u8>, 0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp::LBP<T0, T1>>"}]},{"name":"PoolCreationEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"start_weight_0","type":"u64"},{"name":"end_weight_0","type":"u64"},{"name":"start_timestamp_seconds","type":"u64"},{"name":"end_timestamp_seconds","type":"u64"},{"name":"swap_fee_bps","type":"u64"},{"name":"enabled","type":"bool"},{"name":"pool_id","type":"vector<u8>"}]},{"name":"SetEnabledEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"enabled","type":"bool"},{"name":"pool_id","type":"vector<u8>"}]},{"name":"SetWeightScheduleEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"start_weight_0","type":"u64"},{"name":"end_weight_0","type":"u64"},{"name":"start_timestamp_seconds","type":"u64"},{"name":"end_timestamp_seconds","type":"u64"},{"name":"pool_id","type":"vector<u8>"}]},{"name":"SwapEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"is_buy","type":"bool"},{"name":"amount_0","type":"u64"},{"name":"amount_1","type":"u64"},{"name":"balance_0","type":"u64"},{"name":"balance_1","type":"u64"},{"name":"weight_0","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"weight_1","type":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"},{"name":"pool_id","type":"vector<u8>"}]},{"name":"WhitelistEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]},{"constraints":[]}],"fields":[{"name":"whitelisted","type":"bool"},{"name":"pool_id","type":"vector<u8>"},{"name":"pool_creator","type":"address"}]}]}'
  );
}

export class fees extends AptosBaseProcessor {
  constructor(options: AptosBindOptions) {
    super("fees", options);
  }
  static DEFAULT_OPTIONS: AptosBindOptions = {
    address:
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04",
    network: AptosNetwork.TEST_NET,
  };

  static bind(options: Partial<AptosBindOptions> = {}): fees {
    return new fees({ ...fees.DEFAULT_OPTIONS, ...options });
  }

  onEntryExtractFee(
    func: (call: fees.ExtractFeePayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): fees {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "fees::extract_fee",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySetLbpCommissionBps(
    func: (call: fees.SetLbpCommissionBpsPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): fees {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "fees::set_lbp_commission_bps",
      },
      fetchConfig
    );
    return this;
  }

  onEventFeeParamChangeEvent(
    func: (event: fees.FeeParamChangeEventInstance, ctx: AptosContext) => void,
    fetchConfig?: AptosFetchConfig
  ): fees {
    this.onEvent(
      func,
      {
        type: "fees::FeeParamChangeEvent",
      },
      fetchConfig
    );
    return this;
  }

  loadTypesInternal(registry: TypeRegistry) {
    loadAllTypes(registry);
  }
}

export namespace fees {
  export class FeeParamChangeEvent<T0> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::fees::FeeParamChangeEvent";
    name: string;
    prev_value: bigint;
    new_value: bigint;
  }

  export interface FeeParamChangeEventInstance
    extends TypedEventInstance<FeeParamChangeEvent<any>> {
    data_typed: FeeParamChangeEvent<any>;
    type_arguments: [string];
  }

  export class FeeParams<T0> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::fees::FeeParams";
    lbp_commission_bps: bigint;
    param_change_events: _0x1.event.EventHandle<fees.FeeParamChangeEvent<T0>>;
  }

  export class Fees<T0> {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::fees::Fees";
    coin: _0x1.coin.Coin<T0>;
  }

  export class FeesAccountCapability {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::fees::FeesAccountCapability";
    signer_cap: _0x1.account.SignerCapability;
  }

  export interface ExtractFeePayload<T0 = any>
    extends TypedEntryFunctionPayload<[Address]> {
    arguments_typed: [Address];
    type_arguments: [string];
  }

  export interface SetLbpCommissionBpsPayload<T0 = any>
    extends TypedEntryFunctionPayload<[bigint]> {
    arguments_typed: [bigint];
    type_arguments: [string];
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"fees","friends":["0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::init","0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::lbp"],"exposed_functions":[{"name":"absorb_fee","visibility":"friend","is_entry":false,"generic_type_params":[{"constraints":[]}],"params":["0x1::coin::Coin<T0>"],"return":[]},{"name":"extract_fee","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]}],"params":["&signer","address"],"return":[]},{"name":"initialize","visibility":"friend","is_entry":false,"generic_type_params":[],"params":["&signer"],"return":[]},{"name":"initialize_base_coin","visibility":"friend","is_entry":false,"generic_type_params":[{"constraints":[]}],"params":[],"return":[]},{"name":"initialized","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["bool"]},{"name":"lbp_commission","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]}],"params":["u64"],"return":["u64"]},{"name":"register_coin","visibility":"friend","is_entry":false,"generic_type_params":[{"constraints":[]}],"params":[],"return":[]},{"name":"set_lbp_commission_bps","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]}],"params":["&signer","u64"],"return":[]}],"structs":[{"name":"FeeParamChangeEvent","is_native":false,"abilities":["drop","store"],"generic_type_params":[{"constraints":[]}],"fields":[{"name":"name","type":"0x1::string::String"},{"name":"prev_value","type":"u64"},{"name":"new_value","type":"u64"}]},{"name":"FeeParams","is_native":false,"abilities":["key"],"generic_type_params":[{"constraints":[]}],"fields":[{"name":"lbp_commission_bps","type":"u64"},{"name":"param_change_events","type":"0x1::event::EventHandle<0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::fees::FeeParamChangeEvent<T0>>"}]},{"name":"Fees","is_native":false,"abilities":["key"],"generic_type_params":[{"constraints":[]}],"fields":[{"name":"coin","type":"0x1::coin::Coin<T0>"}]},{"name":"FeesAccountCapability","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"signer_cap","type":"0x1::account::SignerCapability"}]}]}'
  );
}

export class init extends AptosBaseProcessor {
  constructor(options: AptosBindOptions) {
    super("init", options);
  }
  static DEFAULT_OPTIONS: AptosBindOptions = {
    address:
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04",
    network: AptosNetwork.TEST_NET,
  };

  static bind(options: Partial<AptosBindOptions> = {}): init {
    return new init({ ...init.DEFAULT_OPTIONS, ...options });
  }

  onEntryInitialize(
    func: (call: init.InitializePayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): init {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "init::initialize",
      },
      fetchConfig
    );
    return this;
  }

  loadTypesInternal(registry: TypeRegistry) {
    loadAllTypes(registry);
  }
}

export namespace init {
  export interface InitializePayload extends TypedEntryFunctionPayload<[]> {
    arguments_typed: [];
    type_arguments: [];
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"init","friends":[],"exposed_functions":[{"name":"initialize","visibility":"public","is_entry":true,"generic_type_params":[],"params":["&signer"],"return":[]}],"structs":[]}'
  );
}

export namespace math {
  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"math","friends":[],"exposed_functions":[{"name":"calc_in_given_out","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["u64"]},{"name":"calc_out_given_in","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["u64"]},{"name":"interpolate_fp64_with_u64","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64","u64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"mul_div","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","u64","u64"],"return":["u64"]},{"name":"split_swap_fee","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","u64","u64"],"return":["u64","u64","u64"]}],"structs":[]}'
  );
}

export class manager extends AptosBaseProcessor {
  constructor(options: AptosBindOptions) {
    super("manager", options);
  }
  static DEFAULT_OPTIONS: AptosBindOptions = {
    address:
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04",
    network: AptosNetwork.TEST_NET,
  };

  static bind(options: Partial<AptosBindOptions> = {}): manager {
    return new manager({ ...manager.DEFAULT_OPTIONS, ...options });
  }

  onEntryChangeManagerAddress(
    func: (
      call: manager.ChangeManagerAddressPayload,
      ctx: AptosContext
    ) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): manager {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "manager::change_manager_address",
      },
      fetchConfig
    );
    return this;
  }

  loadTypesInternal(registry: TypeRegistry) {
    loadAllTypes(registry);
  }
}

export namespace manager {
  export class Manager {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::manager::Manager";
    manager_address: Address;
  }

  export class ManagerAccountCapability {
    static TYPE_QNAME =
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::manager::ManagerAccountCapability";
    signer_cap: _0x1.account.SignerCapability;
  }

  export interface ChangeManagerAddressPayload
    extends TypedEntryFunctionPayload<[Address]> {
    arguments_typed: [Address];
    type_arguments: [];
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"manager","friends":["0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04::init"],"exposed_functions":[{"name":"change_manager_address","visibility":"public","is_entry":true,"generic_type_params":[],"params":["&signer","address"],"return":[]},{"name":"initialize","visibility":"friend","is_entry":false,"generic_type_params":[],"params":["&signer"],"return":[]},{"name":"initialized","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["bool"]},{"name":"is_manager","visibility":"public","is_entry":false,"generic_type_params":[],"params":["address"],"return":["bool"]}],"structs":[{"name":"Manager","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"manager_address","type":"address"}]},{"name":"ManagerAccountCapability","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"signer_cap","type":"0x1::account::SignerCapability"}]}]}'
  );
}

export namespace coin_helper {
  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"coin_helper","friends":[],"exposed_functions":[{"name":"is_equal","visibility":"public","is_entry":false,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":[],"return":["bool"]}],"structs":[]}'
  );
}

export class lbp_scripts extends AptosBaseProcessor {
  constructor(options: AptosBindOptions) {
    super("lbp_scripts", options);
  }
  static DEFAULT_OPTIONS: AptosBindOptions = {
    address:
      "0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04",
    network: AptosNetwork.TEST_NET,
  };

  static bind(options: Partial<AptosBindOptions> = {}): lbp_scripts {
    return new lbp_scripts({ ...lbp_scripts.DEFAULT_OPTIONS, ...options });
  }

  onEntryAddLiquidity(
    func: (call: lbp_scripts.AddLiquidityPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp_scripts {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp_scripts::add_liquidity",
      },
      fetchConfig
    );
    return this;
  }

  onEntryCreateLbp(
    func: (call: lbp_scripts.CreateLbpPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp_scripts {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp_scripts::create_lbp",
      },
      fetchConfig
    );
    return this;
  }

  onEntryRemoveLiquidity(
    func: (call: lbp_scripts.RemoveLiquidityPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp_scripts {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp_scripts::remove_liquidity",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySwapExactIn(
    func: (call: lbp_scripts.SwapExactInPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp_scripts {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp_scripts::swap_exact_in",
      },
      fetchConfig
    );
    return this;
  }

  onEntrySwapExactOut(
    func: (call: lbp_scripts.SwapExactOutPayload, ctx: AptosContext) => void,
    filter?: CallFilter,
    fetchConfig?: AptosFetchConfig
  ): lbp_scripts {
    this.onEntryFunctionCall(
      func,
      {
        ...filter,
        function: "lbp_scripts::swap_exact_out",
      },
      fetchConfig
    );
    return this;
  }

  loadTypesInternal(registry: TypeRegistry) {
    loadAllTypes(registry);
  }
}

export namespace lbp_scripts {
  export interface AddLiquidityPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[bigint, bigint, bigint, bigint]> {
    arguments_typed: [bigint, bigint, bigint, bigint];
    type_arguments: [string, string];
  }

  export interface CreateLbpPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<
      [bigint, bigint, bigint, bigint, bigint, bigint, bigint, Boolean]
    > {
    arguments_typed: [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      Boolean
    ];
    type_arguments: [string, string];
  }

  export interface RemoveLiquidityPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[bigint, bigint, bigint]> {
    arguments_typed: [bigint, bigint, bigint];
    type_arguments: [string, string];
  }

  export interface SwapExactInPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[string, bigint, bigint, bigint]> {
    arguments_typed: [string, bigint, bigint, bigint];
    type_arguments: [string, string];
  }

  export interface SwapExactOutPayload<T0 = any, T1 = any>
    extends TypedEntryFunctionPayload<[string, bigint, bigint, bigint]> {
    arguments_typed: [string, bigint, bigint, bigint];
    type_arguments: [string, string];
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x1001fadfd3543e1d3caa1af08b3f256a4896dad6b6dd62cde80015027ca0be04","name":"lbp_scripts","friends":[],"exposed_functions":[{"name":"add_liquidity","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","u64","u64","u64","u64"],"return":[]},{"name":"create_lbp","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","u64","u64","u64","u64","u64","u64","u64","bool"],"return":[]},{"name":"remove_liquidity","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","u64","u64","u64"],"return":[]},{"name":"swap_exact_in","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","vector<u8>","u64","u64","u64"],"return":[]},{"name":"swap_exact_out","visibility":"public","is_entry":true,"generic_type_params":[{"constraints":[]},{"constraints":[]}],"params":["&signer","vector<u8>","u64","u64","u64"],"return":[]}],"structs":[]}'
  );
}

export function loadAllTypes(_r: TypeRegistry) {
  _0x1.loadAllTypes(_r);
  _0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87.loadAllTypes(
    _r
  );

  _r.load(lbp.ABI);
  _r.load(fees.ABI);
  _r.load(init.ABI);
  _r.load(math.ABI);
  _r.load(manager.ABI);
  _r.load(coin_helper.ABI);
  _r.load(lbp_scripts.ABI);
}
