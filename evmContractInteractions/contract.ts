
import { ethers } from "ethers";
import {
  callBorrowerOperationsContract,
  callTroveManagerContract,
  callStabilityPoolContract,
} from "./ethereumContracts";
import { CollateralAsset } from "@/types/types";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import { getRequestAmount } from "@/utils/contractUtils";
import { ChainName } from '@/enums/Chain';

export const getAppEVMContract = () => {
  let _maxFeePercentage = "5000000000000000";
  let _upperHint = "0x0000000000000000000000000000000000000000";
  let _lowerHint = "0x0000000000000000000000000000000000000000";
  let asset = DefaultAssetByChainName[ChainName.EVM];
  console.log("asset", asset);
  
  const openTrove = async (
    senderAddress: string,
    amount: number,
    loanAmount: number,
    collRatio: number,
    x:any
  ) => {
    try {
      const openTrove = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.openTrove(
        _maxFeePercentage,
        getRequestAmount(loanAmount, asset.ausdDecimal),
        _upperHint,
        _lowerHint,
        { value: getRequestAmount(amount, asset.decimal) }
      );

      return await openTrove;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const addCollateral = async (_upperHint: string, _lowerHint: string) => {
    try {
      const addColl = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.addColl(_upperHint, _lowerHint);
      return await addColl;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callGetAUSDValue = async (_coll: number) => {
    try {
      const getAUSDValue = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.getAUSDValue(_coll);
      return await getAUSDValue;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callCloseTrove = async (_borrower: string) => {
    try {
      const closeTrove = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.closeTrove(_borrower);
      return await closeTrove;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callRepayAUSD = async (
    _AUSDAmount: number,
    _upperHint: string,
    _lowerHint: string
  ) => {
    try {
      const repayAUSD = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.repayAUSD(_AUSDAmount, _upperHint, _lowerHint);
      return await repayAUSD;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callMoveETHGainToTrove = async (
    _borrower: string,
    _upperHint: string,
    _lowerHint: string
  ) => {
    try {
      const moveETHGainToTrove = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.moveETHGainToTrove(
        _borrower,
        _upperHint,
        _lowerHint
      );
      return await moveETHGainToTrove;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callWithdrawColl = async (
    _collWithdrawal: number,
    _upperHint: string,
    _lowerHint: string
  ) => {
    try {
      const withdrawColl = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.withdrawColl(
        _collWithdrawal,
        _upperHint,
        _lowerHint
      );
      return await withdrawColl;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callWithdrawAUSD = async (
    _maxFeePercentage: number,
    _AUSDAmount: number,
    _upperHint: string,
    _lowerHint: string
  ) => {
    try {
      const withdrawAUSD = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.withdrawAUSD(
        _maxFeePercentage,
        _AUSDAmount,
        _upperHint,
        _lowerHint
      );
      return await withdrawAUSD;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const callAdjustTrove = async (
    _maxFeePercentage: number,
    _collWithdrawal: number,
    _AUSDChange: boolean,
    _isDebtIncrease: boolean,
    _upperHint: string,
    _lowerHint: string
  ) => {
    try {
      const adjustTrove = await (
        await callBorrowerOperationsContract()
      ).contractWithSigner.adjustTrove(
        _maxFeePercentage,
        _collWithdrawal,
        _AUSDChange,
        _isDebtIncrease,
        _upperHint,
        _lowerHint
      );
      return await adjustTrove;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    /*  getTotalCollateralAmounts,
    getTotalDebtAmount,
    getTrove,
    getStake,
    getTotalStake,
    getCollateralPrice,
    getAusdBalance,
    getAusdInfo,
    getReward, */
    openTrove,
    addCollateral,
    /*removeCollateral,
    borrowLoan,
    repayLoan,
    stake,
    unstake,
    redeem,
    liquidateTroves,
    liquidateTrovesV2,
    withdrawLiquidationGains */
  };
};
