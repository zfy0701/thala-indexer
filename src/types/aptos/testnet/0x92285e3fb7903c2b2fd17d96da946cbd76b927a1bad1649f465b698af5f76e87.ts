/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

/* Generated modules for account 0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87 */

import {
  MoveCoder,
  AptosBindOptions,
  AptosBaseProcessor,
  TypedEventInstance,
  AptosNetwork,
  TypedEntryFunctionPayload,
  AptosContext,
  CallFilter,
} from "@sentio/sdk/aptos";
import { AptosFetchConfig } from "@sentio/protos";
import { Address, MoveModule } from "@sentio/sdk/aptos";

export namespace log_exp_math {
  export function loadTypes(_r: MoveCoder) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87","name":"log_exp_math","friends":[],"exposed_functions":[{"name":"exp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u8","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"ln","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u8","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"log2","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u8","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"pow","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]}],"structs":[]}'
  );
}

export namespace fixed_point64 {
  export class FixedPoint64 {
    static TYPE_QNAME =
      "0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64";
    v: bigint;
  }

  export function loadTypes(_r: MoveCoder) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87","name":"fixed_point64","friends":[],"exposed_functions":[{"name":"add","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"add_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"compare","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u8"]},{"name":"decode","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"decode_round_down","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"decode_round_up","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u64"]},{"name":"div","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"div_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"encode","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"eq","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"fraction","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"from_u128","visibility":"public","is_entry":false,"generic_type_params":[],"params":["u128"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"gt","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"gte","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"is_zero","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"lt","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"lte","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["bool"]},{"name":"max","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"min","visibility":"public","is_entry":false,"generic_type_params":[],"params":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["&0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"mul","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"mul_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"one","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"sub","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","u64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"sub_fp","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64","0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]},{"name":"to_u128","visibility":"public","is_entry":false,"generic_type_params":[],"params":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"],"return":["u128"]},{"name":"zero","visibility":"public","is_entry":false,"generic_type_params":[],"params":[],"return":["0x92285e3fb7903c2b2fd17d96da946cbd76b927a1bad1649f465b698af5f76e87::fixed_point64::FixedPoint64"]}],"structs":[{"name":"FixedPoint64","is_native":false,"abilities":["copy","drop","store"],"generic_type_params":[],"fields":[{"name":"v","type":"u128"}]}]}'
  );
}

export function loadAllTypes(_r: MoveCoder) {
  _r.load(log_exp_math.ABI);
  _r.load(fixed_point64.ABI);
}
