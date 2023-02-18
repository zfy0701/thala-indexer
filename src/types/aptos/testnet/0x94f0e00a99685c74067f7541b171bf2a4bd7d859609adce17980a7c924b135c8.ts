/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

/* Generated modules for account 0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8 */

import { CallFilter } from "@sentio/sdk/move";
import {
  MoveCoder,
  AptosBindOptions,
  AptosBaseProcessor,
  TypedEventInstance,
  AptosNetwork,
  TypedEntryFunctionPayload,
  AptosContext,
} from "@sentio/sdk/aptos";
import { MoveFetchConfig } from "@sentio/protos";
import { Address, MoveModule } from "@sentio/sdk/aptos";

export namespace log_exp_math {
  export function loadTypes(_r: MoveCoder) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8","name":"log_exp_math","friends":[],"exposed_functions":[{"name":"exp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u8","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"ln","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u8","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"log2","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u8","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"pow","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"pow_down","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"pow_up","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]}],"structs":[]}'
  );
}

export namespace fixed_point64 {
  export class FixedPoint64 {
    static TYPE_QNAME =
      "0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64";
    v: bigint;
  }

  export function loadTypes(_r: MoveCoder) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8","name":"fixed_point64","friends":[],"exposed_functions":[{"name":"add","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"add_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"compare","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u8"]},{"name":"decode","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"decode_round_down","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"decode_round_up","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"div","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"div_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"encode","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"eq","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"fraction","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"from_u128","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u128"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"gt","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"gte","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"is_zero","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"lt","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"lte","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"max","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"min","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["&0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"mul","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"mul_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"one","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"sub","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","u64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"sub_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64","0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]},{"name":"to_u128","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"],"return":["u128"]},{"name":"zero","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["0x94f0e00a99685c74067f7541b171bf2a4bd7d859609adce17980a7c924b135c8::fixed_point64::FixedPoint64"]}],"structs":[{"name":"FixedPoint64","is_native":false,"abilities":["copy","drop","store"],"generic_type_params":[],"fields":[{"name":"v","type":"u128"}]}]}'
  );
}

export function loadAllTypes(_r: MoveCoder) {
  _r.load(log_exp_math.ABI);
  _r.load(fixed_point64.ABI);
}