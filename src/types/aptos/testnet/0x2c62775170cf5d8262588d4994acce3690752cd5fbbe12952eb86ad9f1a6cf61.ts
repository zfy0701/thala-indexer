/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

/* Generated modules for account 0x2c62775170cf5d8262588d4994acce3690752cd5fbbe12952eb86ad9f1a6cf61 */

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

export namespace stable_pool_lp_coin {
  export class StablePoolToken<T0, T1, T2, T3> {
    static TYPE_QNAME =
      "0x2c62775170cf5d8262588d4994acce3690752cd5fbbe12952eb86ad9f1a6cf61::stable_pool_lp_coin::StablePoolToken";
    dummy_field: Boolean;
  }

  export function loadTypes(_r: TypeRegistry) {
    loadAllTypes(_r);
  }
  export const ABI: MoveModule = JSON.parse(
    '{"address":"0x2c62775170cf5d8262588d4994acce3690752cd5fbbe12952eb86ad9f1a6cf61","name":"stable_pool_lp_coin","friends":[],"exposed_functions":[],"structs":[{"name":"StablePoolToken","is_native":false,"abilities":[],"generic_type_params":[{"constraints":[]},{"constraints":[]},{"constraints":[]},{"constraints":[]}],"fields":[{"name":"dummy_field","type":"bool"}]}]}'
  );
}

export function loadAllTypes(_r: TypeRegistry) {
  _r.load(stable_pool_lp_coin.ABI);
}
