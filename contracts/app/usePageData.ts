import { PageData } from "@/app/app/dashboard/_types/types";
import { requestTotalTroves } from "@/services/graphql";
import { convertAmount } from "@/utils/contractUtils";
import { getSettledValue } from "@/utils/promiseUtils";
import { useCallback, useEffect, useState } from "react";
import useAppContract from "./useAppContract";

interface Props {
  basePrice: number
}

const usePageData = ({ basePrice }: Props) => {

  const contract = useAppContract();

  const [pageData, setPageData] = useState<PageData>({
    collateralAmount: 0,
    debtAmount: 0,
    ausdBalance: 0,
    stakedAmount: 0,
    totalCollateralAmount: 0,
    totalDebtAmount: 0,
    totalAusdSupply: 0,
    totalStakedAmount: 0,
    totalTrovesAmount: 0,
    poolShare: 0,
    rewardAmount: 0,
    minCollateralRatio: 0,
    minRedeemAmount: 0
  })

  const getPageData = useCallback(async () => {
    try {
      const [
        troveRes,
        ausdBalanceRes,
        stakeRes,
        totalStakeRes,
        totalCollateralRes,
        totalDebtRes,
        ausdInfoRes,
        rewardRes,
        totalTrovesRes
      ] = await Promise.allSettled([
        contract.getTrove(),
        contract.getAusdBalance(),
        contract.getStake(),
        contract.getTotalStake(),
        contract.getTotalCollateralAmount(),
        contract.getTotalDebtAmount(),
        contract.getAusdInfo(),
        contract.getReward(),
        requestTotalTroves()
      ]);

      const collateralAmount = convertAmount(getSettledValue(troveRes)?.collateral_amount ?? 0)
      const debtAmount = convertAmount(getSettledValue(troveRes)?.debt_amount ?? 0)

      setPageData({
        collateralAmount,
        debtAmount,
        ausdBalance: convertAmount(getSettledValue(ausdBalanceRes)?.balance ?? 0),
        stakedAmount: convertAmount(getSettledValue(stakeRes)?.amount ?? 0),
        totalCollateralAmount: convertAmount(getSettledValue(totalCollateralRes) ?? 0),
        totalDebtAmount: convertAmount(getSettledValue(totalDebtRes) ?? 0),
        totalAusdSupply: convertAmount(getSettledValue(ausdInfoRes)?.total_supply ?? 0),
        totalStakedAmount: convertAmount(getSettledValue(totalStakeRes) ?? 0),
        poolShare: Number(Number(getSettledValue(stakeRes)?.percentage).toFixed(3)),
        rewardAmount: convertAmount(getSettledValue(rewardRes) ?? 0),
        minCollateralRatio: (collateralAmount * basePrice) / (debtAmount || 1),
        minRedeemAmount: basePrice,
        totalTrovesAmount: getSettledValue(totalTrovesRes)?.troves.totalCount ?? 0
      })
    }
    catch (err) {
      console.error(err);

      setPageData({
        collateralAmount: 0,
        debtAmount: 0,
        ausdBalance: 0,
        stakedAmount: 0,
        totalCollateralAmount: 0,
        totalDebtAmount: 0,
        totalAusdSupply: 0,
        totalStakedAmount: 0,
        poolShare: 0,
        rewardAmount: 0,
        minCollateralRatio: 0,
        minRedeemAmount: 0,
        totalTrovesAmount: 0
      })
    }
  }, [contract, basePrice])

  useEffect(() => {
    getPageData();
  }, [getPageData])

  return {
    pageData,
    getPageData
  }
}

export default usePageData;