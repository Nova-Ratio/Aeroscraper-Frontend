'use client';

import usePageData from "@/contracts/app/usePageData";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { useState, useMemo, useEffect } from "react";

export default function InjectiveDashboard() {

  const [basePrice, setBasePrice] = useState(0);
  const { pageData, getPageData } = usePageData({ basePrice });

  useEffect(() => {
    const getPrice = async () => {
      const connection = new PriceServiceConnection(
        "https://hermes-beta.pyth.network/",
        {
          priceFeedRequestConfig: {
            binary: true,
          },
        }
      )

      const priceId = ["2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3"];

      const currentPrices = await connection.getLatestPriceFeeds(priceId);

      if (currentPrices) {
        setBasePrice(Number(currentPrices[0].getPriceUnchecked().price) / 100000000);
      }
    }

    getPrice()
  }, [])

  return (
    <div>
      <div className="max-w-[400px] w-[379px]">
        <h1 className="text-white text-[42px] leading-[54px] font-bold">Your decentralised lending-borrowing protocol</h1>
        <h2 className="text-base text-ghost-white font-medium mt-4">Welcome to the Aeroscraper app. Here you can open a trove to borrow AUSD, earn AUSD rewards by depositing AUSD to the Stability pool, or Liquidate Risky Troves.</h2>
      </div>
    </div>
  )
}