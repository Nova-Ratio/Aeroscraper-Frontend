import SkeletonLoading from '@/components/Table/SkeletonLoading';
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

export type InjectiveTabs = "trove" | "createTrove" | "stabilityPool" | "redeem" | "riskyTroves" | "rewards";

const InjectiveTabsSide: FC<Props> = ({ setTabPosition }) => {
  const [basePrice, setBasePrice] = useState(0);
  const { pageData, getPageData, loading } = usePageData({ basePrice });
  const { refreshBalance } = useWallet();

  const [isTroveOpened, setIsTroveOpened] = useState(true);

  let TabList: InjectiveTabs[] = [isTroveOpened ? "trove" : "createTrove", "stabilityPool", "redeem", "riskyTroves", "rewards"];

  const [selectedTab, setSelectedTab] = useState<InjectiveTabs>("trove");

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

  useEffect(() => {
    if (!loading && pageData) {
      setIsTroveOpened(pageData.collateralAmount > 0);
      setSelectedTab(pageData.collateralAmount > 0 ? "trove" : "createTrove")
    }
  }, [loading]);

  return (
    <div className='flex-1 max-w-[784px] mt-16 ml-auto'>
      <Tabs tabs={TabList} dots={pageData.rewardAmount > 0 ? ["rewards"] : undefined} selectedTab={selectedTab} onTabSelected={(e) => { setSelectedTab(e); setTabPosition(e); }} loading={loading} />
      {loading ? <div className='space-y-4 mt-16'>
        <SkeletonLoading height={'h-10'} width={"w-[50%]"} noPadding noMargin />
        <SkeletonLoading height={'h-6'} width={"w-1/3"} noPadding noMargin />
        <SkeletonLoading height={'h-4'} width={"w-1/3"} noPadding noMargin />
        <SkeletonLoading height={'h-40'} width={"w-full"} noPadding noMargin />
      </div>
        :
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
          {selectedTab === "rewards" && <ClaimRewardTab pageData={pageData} getPageData={getPageData} refreshBalance={refreshBalance} basePrice={basePrice} />}
        </motion.main>
      }

    </div>
  )
}

export default React.memo(InjectiveTabsSide);