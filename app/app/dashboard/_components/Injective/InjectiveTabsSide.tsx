import Tabs from '@/components/Tabs';
import { useWallet } from '@/contexts/WalletProvider';
import usePageData from '@/contracts/app/usePageData';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { motion } from 'framer-motion';
import React, { Dispatch, FC, useEffect, useMemo, useState } from 'react'
import ClaimRewardTab from './Tabs/ClaimRewardTab';
import RedeemTab from './Tabs/RedeemTab';
import RiskyTrovesTab from './Tabs/RiskyTrovesTab';
import StabilityPoolTab from './Tabs/StabilityPoolTab';
import TroveTab from './Tabs/TroveTab';

interface Props {
  setTabPosition: Dispatch<InjectiveTabs>
}

export type InjectiveTabs = "trove" | "createTrove" | "stabilityPool" | "redeem" | "riskyTroves" | "claimRewards";

const InjectiveTabsSide: FC<Props> = ({ setTabPosition }) => {
  const [basePrice, setBasePrice] = useState(0);
  const { pageData, getPageData, } = usePageData({ basePrice });
  const { refreshBalance } = useWallet();

  const isTroveOpened = useMemo(() => { return pageData.collateralAmount > 0 }, [pageData])

  let TabList: InjectiveTabs[] = [isTroveOpened ? "trove" : "createTrove", "stabilityPool", "redeem", "riskyTroves", "claimRewards"];

  const [selectedTab, setSelectedTab] = useState<InjectiveTabs>("redeem");

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
    <div className='flex-1 max-w-[784px] mt-16 ml-auto'>
      <Tabs tabs={TabList} selectedTab={selectedTab} onTabSelected={(e) => { setSelectedTab(e); setTabPosition(e); }} />
      <motion.main
        key={selectedTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className='mt-14'>
        {selectedTab === (isTroveOpened ? "trove" : "createTrove") && <TroveTab pageData={pageData} getPageData={getPageData} basePrice={basePrice} />}
        {selectedTab === "stabilityPool" && <StabilityPoolTab pageData={pageData} getPageData={getPageData} />}
        {selectedTab === "redeem" && <RedeemTab pageData={pageData} getPageData={getPageData} refreshBalance={refreshBalance} basePrice={basePrice} />}
        {selectedTab === "riskyTroves" && <RiskyTrovesTab pageData={pageData} getPageData={getPageData} basePrice={basePrice} />}
        {selectedTab === "claimRewards" && <ClaimRewardTab pageData={pageData} getPageData={getPageData} refreshBalance={refreshBalance} basePrice={basePrice} />}
      </motion.main>
    </div>
  )
}

export default React.memo(InjectiveTabsSide);