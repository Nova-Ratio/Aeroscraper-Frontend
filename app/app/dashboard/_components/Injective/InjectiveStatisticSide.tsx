import InjectiveStatisticCard from '@/components/Cards/InjectiveStatisticCard';
import { ChevronUpIcon } from '@/components/Icons/Icons';
import { useWallet } from '@/contexts/WalletProvider';
import usePageData from '@/contracts/app/usePageData';
import { motion } from 'framer-motion';
import { isNil } from 'lodash';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react'

interface Props {
  basePrice: number,
  disabledStats?: boolean
}

const INTERVAL_TIME = 8000;
const content:
  { title: string, desc: string, linkStr?: string, linkUrl?: string }[] = [
    {
      title: "Your decentralized lending-borrowing protocol",
      desc: "Welcome to the Aeroscraper app. Here you can open a trove to borrow AUSD, earn AUSD rewards by depositing AUSD to the Stability pool, or Liquidate Risky Troves."
    },
    {
      title: "Open your Trove and Mint AUSD",
      desc: "Open your first trove using INJ and mint AUSD. You can add or remove collaterals to your Trove later, mint more AUSD, or pay off your debt."
    },
    {
      title: "Stake your AUSD to Stability Pool",
      desc: "Get a right to earn rewards from liquid troves by staking your AUSD to the stability pool."
    },
    {
      title: "Rewards!",
      desc: "Collect the rewards you earned from liquid troves."
    },
    {
      title: "Don't miss our latest Galxe campaign",
      desc: "Get a chance to win exclusive rewards by participating in our current Galxe campaign.",
      linkStr: "participating",
      linkUrl: "https://galxe.com/aeroscraper/campaign/GCfPktUfsC"
    },
    {
      title: "Check out the Zealy missions!",
      desc: "Complete Zealy missions to raise your ranks in the leaderboard!",
      linkStr: "Zealy",
      linkUrl: "https://zealy.io/c/aeroscraper/questboard"
    },
    {
      title: "Injective Faucet",
      desc: "Get your Injective(Testnet) tokens here.",
      linkStr: "here",
      linkUrl: "https://testnet.faucet.injective.network/"
    }
  ]

const InjectiveStatisticSide: FC<Props> = ({ basePrice, disabledStats }) => {

  const { baseCoin, walletType } = useWallet();
  const [showStatistic, setShowStatistic] = useState<boolean>(true);

  const { pageData } = usePageData({ basePrice });

  const [showContentIdx, setShowContentIdx] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!hovering) {
      timer = setInterval(() => {
        setShowContentIdx(prev => (prev + 1) === content.length ? 0 : (prev + 1));
      }, INTERVAL_TIME);
    }

    return () => {
      clearInterval(timer);
    };
  }, [hovering]);

  const handleHover = (isHovering: boolean) => {
    setHovering(isHovering);
  };

  const renderDescription = () => {
    const item = content[showContentIdx];
    if (item.linkStr && item.linkUrl) {
      const parts = item.desc.split(item.linkStr);
      return (
        <>
          {parts[0]}
          <Link target={"_blank"} href={item.linkUrl} className="text-[#F8B810] animate-pulse">
            {item.linkStr}
          </Link>
          {parts[1]}
        </>
      );
    }
    return item.desc;
  };

  return (
    <div
      className="max-w-[400px] w-[379px] group"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <motion.div
        key={showContentIdx}
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.98 }}
        transition={{ ease: "easeInOut", duration: 1.2 }}
        layout
        className="min-h-[266px]"
      >
        <h1 className="text-white text-[39px] leading-[50px] font-semibold">{content[showContentIdx].title}</h1>
        <h2 className="text-base text-ghost-white font-medium mt-4">
          {renderDescription()}
        </h2>
      </motion.div>
      <div className='space-x-1 group-hover:opacity-100 opacity-0 transition-opacity my-2'>
        {
          content.map((i, idx) => {
            return <button key={idx} onClick={() => { setShowContentIdx(idx); }} className={`w-2 h-2 rounded-sm ${showContentIdx === idx ? "bg-[#E4462D]" : "bg-ghost-white"}`} />
          })
        }
      </div>

      {!disabledStats &&
        <>
          <button onClick={() => { setShowStatistic(prev => !prev); }} className='text-base font-medium text-[#E4462D] hover:text-[#F8B810] transition-colors duration-300 flex gap-1 mb-4'>
            Protocol statistics
            <ChevronUpIcon className={`w-5 h-5 mt-0.5 transition-all duration-300 ${showStatistic ? "rotate-180" : ""}`} />
          </button>
          {showStatistic && (
            <motion.div
              layout
              initial={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="grid grid-cols-2 justify-center gap-x-16 gap-y-4 mt-6">
              <InjectiveStatisticCard
                title="Management Fee"
                description="0.5%"
                className="w-[191px] h-14"
                tooltip="This amount is deducted from the collateral amount as a management fee. There are no recurring fees for borrowing, which is thus interest-free."
                tooltipPlacement="right-bottom"
              />
              <InjectiveStatisticCard
                title="Liquidation Threshold"
                description="115%"
                className="w-[191px] h-14"
                tooltip="Liquidation Threshold Ratio"
                tooltipPlacement="top"
              />
              <InjectiveStatisticCard
                title="Total Value Locked"
                description={isNil(baseCoin) ? '-' : `${Number(pageData.totalCollateralAmount).toFixed(6)} ${baseCoin.name}`}
                className="w-[191px] h-14"
                tooltip="The Total Value Locked (TVL) is the total value of sei locked as collateral in the system."
                tooltipPlacement="top"
              />
              <InjectiveStatisticCard
                title="AUSD in Stability Pool"
                tooltipPlacement="top"
                description={Number(pageData.totalStakedAmount).toFixed(3).toString()}
                className="w-[191px] h-14"
                tooltip="The total AUSD currently held in the Stability Pool."
              />
              <InjectiveStatisticCard
                title="Troves"
                description={`${isNil(walletType) ? "-" : pageData.totalTrovesAmount}`}
                className="w-[191px] h-14"
                tooltip="The total number of active Troves in the system."
                tooltipPlacement="right-bottom"
              />
              <InjectiveStatisticCard
                title="Total Collateral Ratio"
                tooltipPlacement="top"
                description={`${isFinite(Number(((pageData.totalCollateralAmount * basePrice) / pageData.totalDebtAmount) * 100)) ? Number(((pageData.totalCollateralAmount * basePrice) / pageData.totalDebtAmount) * 100).toFixed(3) : 0} %`}
                className="w-[191px] h-14"
                tooltip={`The ratio of the Dollar value of the entire system collateral at the current ${baseCoin?.name}:AUSD price, to the entire system debt.`}
              />
              <InjectiveStatisticCard
                title="AUSD Supply"
                description={Number(pageData.totalAusdSupply).toFixed(3).toString()}
                className="w-[191px] h-14"
                tooltip="The total AUSD minted by the Aeroscraper Protocol."
                tooltipPlacement="top"
              />
            </motion.div>
          )}
        </>}
    </div>
  )
}

export default React.memo(InjectiveStatisticSide)