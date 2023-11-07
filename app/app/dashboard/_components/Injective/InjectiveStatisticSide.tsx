import InjectiveStatisticCard from '@/components/Cards/InjectiveStatisticCard';
import { ChevronUpIcon } from '@/components/Icons/Icons';
import { useWallet } from '@/contexts/WalletProvider';
import usePageData from '@/contracts/app/usePageData';
import { motion } from 'framer-motion';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react'

interface Props {
  basePrice:number
}

const InjectiveStatisticSide:FC<Props> = ({basePrice}) => {

  const { baseCoin,walletType } = useWallet();
  const [showStatistic, setShowStatistic] = useState<boolean>(true);

  const { pageData } = usePageData({ basePrice });

  return (
    <div className="max-w-[400px] w-[379px]">
      <h1 className="text-white text-[42px] leading-[54px] font-semibold">Your decentralised lending-borrowing protocol</h1>
      <h2 className="text-base text-ghost-white font-medium mt-4">Welcome to the Aeroscraper app. Here you can open a trove to borrow AUSD, earn AUSD rewards by depositing AUSD to the Stability pool, or Liquidate Risky Troves.</h2>

      <button onClick={() => { setShowStatistic(prev => !prev); }} className='text-base font-medium text-[#E4462D] hover:text-[#F8B810] transition-colors duration-300 flex gap-1 mt-8 mb-4'>
        Protocol statistics
        <ChevronUpIcon className={`w-5 h-5 mt-0.5 transition-all duration-300 ${showStatistic ? "rotate-180" : ""}`} />
      </button>
      {showStatistic && (
        <motion.div
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
            description={isNil(baseCoin) ? '-' : `${Number(pageData.totalCollateralAmount).toFixed(3)} ${baseCoin.name}`}
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
    </div>
  )
}

export default React.memo(InjectiveStatisticSide)