import { BigDecimal } from "@sentio/sdk";
import { getPriceBySymbol, getPriceByType } from "@sentio/sdk/utils";
import { CHAIN_IDS } from "@sentio/sdk";

// if coin is not found in COMMON_COINS, we use 8 decimals by default
// in that case, frontend / metrics users need to handle scaling if decimal is incorrect
const DEFAULT_DECIMALS = 8;

const TEST_COINS_ADDRESS =
  "0x3c27315fb69ba6e4b960f1507d1cefcc9a4247869f26a8d59d6b7869d23782c";
const WBTC = `${TEST_COINS_ADDRESS}::test_coins::WBTC`;
const WETH = `${TEST_COINS_ADDRESS}::test_coins::WETH`;
const USDC = `${TEST_COINS_ADDRESS}::test_coins::USDC`;
const CAKE = `${TEST_COINS_ADDRESS}::test_coins::CAKE`;
const TAPT = `${TEST_COINS_ADDRESS}::test_coins::TAPT`;

const COIN_DECIMALS: { [key: string]: number } = {
  "0x1::aptos_coin::AptosCoin": 8,
  [WBTC]: 8,
  [WETH]: 6,
  [USDC]: 6,
  [TAPT]: 8,
  [CAKE]: 8,
};

export async function getPriceAsof(
  coinType: string,
  asof: Date
): Promise<number> {
  if (coinType.includes("mod_coin::MOD")) {
    return 1;
  }
  if (coinType.includes("PoolToken")) {
    // TODO: support LP price https://linear.app/thala-labs/issue/THA-785/index-lpt-price-history
    return 0;
  }

  try {
    if (coinType.includes("test_coins")) {
      return await getPriceBySymbol(coinType.split("::")[2], asof);
    }

    return await getPriceByType(
      // use mainnet price is fine
      CHAIN_IDS.APTOS_MAINNET,
      coinType,
      asof
    );
  } catch (e) {
    // if price is not found, return 0
    return 0;
  }
}

export function scaleDown(n: bigint, decimals: number): BigDecimal {
  return n.asBigDecimal().dividedBy(10 ** decimals);
}

export function getCoinDecimals(address: string): number {
  return COIN_DECIMALS[address] ?? DEFAULT_DECIMALS;
}

// use "123456coin1Name-789012coin2Name" as pair tag for each pool
// the first 6 digits of coin address are used to reduce the length of the tag
// tags are sorted alphabetically
export function getPairTag(coin0: string, coin1: string): string {
  const fragments0 = coin0.split("::");
  const coinTag0 =
    fragments0[0].slice(2, 8) + fragments0[fragments0.length - 1];
  const fragments1 = coin1.split("::");
  const coinTag1 =
    fragments1[0].slice(2, 8) + fragments1[fragments1.length - 1];
  return coinTag0.localeCompare(coinTag1) < 0
    ? coinTag0.concat("-").concat(coinTag1)
    : coinTag1.concat("-").concat(coinTag0);
}

export function getDateTag(timeStamp: number): string {
  return new Date(timeStamp).toDateString();
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
