import { coin, optional_aggregator } from "@sentio/sdk/aptos/builtin/0x1";
import { AptosResourcesProcessor, defaultMoveCoder } from "@sentio/sdk/aptos";
import { Gauge } from "@sentio/sdk";

const START_VERSION = 2375822;

const LAYERZERO_USDC =
  "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC";

const totalSupply = Gauge.register("total_supply", { sparse: true });

AptosResourcesProcessor.bind({
  address: LAYERZERO_USDC.split("::")[0],
  startVersion: START_VERSION,
}).onTimeInterval(
  async (resources, ctx) => {
    const coinInfoRes = defaultMoveCoder().filterAndDecodeResources<
      coin.CoinInfo<any>
    >(coin.CoinInfo.TYPE_QNAME, resources);
    if (coinInfoRes.length === 0) {
      return;
    }
    const coinInfo = coinInfoRes[0].data_decoded;
    if (coinInfo.supply.vec.length === 0) {
      return;
    }
    const aggOption = (
      coinInfo.supply.vec as optional_aggregator.OptionalAggregator[]
    )[0];
    if (aggOption.integer.vec.length) {
      const value = (aggOption.integer.vec[0] as optional_aggregator.Integer)
        .value;

      totalSupply.record(ctx, value.scaleDown(coinInfo.decimals), {
        coin: LAYERZERO_USDC,
      });
    }
  },
  60,
  60 * 12,
  `0x1::coin::CoinInfo<${LAYERZERO_USDC}>`
);
