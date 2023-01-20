import { BigDecimal } from "@sentio/sdk";
import { conversion } from "@sentio/sdk/lib/utils";

interface CoinInfo {
  address: string;
  decimals: number;
}

// if coin is not found in COMMON_COINS, we use 8 decimals by default
// in that case, frontend / metrics users need to handle scaling if decimal is incorrect
const DEFAULT_DECIMALS = 8;

const COMMON_COINS: { [key: string]: CoinInfo } = {
  "0x1::aptos_coin::AptosCoin": {
    address: "0x1::aptos_coin::AptosCoin",
    decimals: 8,
  },

  // below are test coins
  "0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1::BTC":
    {
      address:
        "0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::TestCoinsV1::BTC",
      decimals: 8,
    },
  "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_A":
    {
      address:
        "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_A",
      decimals: 8,
    },
  "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_B":
    {
      address:
        "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_B",
      decimals: 7,
    },
  "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_C":
    {
      address:
        "0x9318e16d6d213c3aefcad039ab9fe018ac22ec12af338baf36b9abdda81cc5ba::test_coins::FakeCoin_C",
      decimals: 6,
    },
};

export function scaleDown(n: bigint, decimals: number): BigDecimal {
  return conversion.toBigDecimal(n).dividedBy(10 ** decimals);
}

export function getCoinDecimals(address: string): number {
  const info = COMMON_COINS[address];
  return info ? info.decimals : DEFAULT_DECIMALS;
}

// use "123456coin1Name-789012coin2Name" as pair tag for each pool
// the first 6 digits of coin address are used to reduce the length of the tag
export function getPairTag(coin0: string, coin1: string): string {
  const fragments0 = coin0.split("::");
  const coinTag0 = fragments0[0].slice(2, 8) + fragments0[fragments0.length - 1]
  const fragments1 = coin1.split("::");
  const coinTag1 = fragments1[0].slice(2, 8) + fragments1[fragments1.length - 1]
  return coinTag0.concat('-').concat(coinTag1);
}

// input cannot be larger the 2^31
// this should allow at least 6 digits precision in the fractional part
// https://stackoverflow.com/questions/45929493/node-js-maximum-safe-floating-point-number
export function fp64ToFloat(a: bigint): number {
  // avoid large number
  let mask = BigInt("0xffffffff000000000000000000000000");
  if ((a & mask) != 0n) {
    throw new Error("too large");
  }

  // integer part
  mask = BigInt("0x10000000000000000");
  let base = 1;
  let result = 0;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) != 0n) {
      result += base;
    }
    base *= 2;
    mask = mask << 1n;
  }

  // fractional part
  mask = BigInt("0x8000000000000000");
  base = 0.5;
  for (let i = 0; i < 32; ++i) {
    if ((a & mask) != 0n) {
      result += base;
    }
    base /= 2;
    mask = mask >> 1n;
  }
  return result;
}

export function bigintToInteger(a: bigint): number {
  if (a > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("too large");
  }
  return Number(a);
}
