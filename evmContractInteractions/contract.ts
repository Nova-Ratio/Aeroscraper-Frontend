import { ethers } from "ethers";
import {
  callBorrowerOperationsContract,
  callTroveManagerContract,
  callStabilityPoolContract,
  callAUSDTTokenContract,
} from "./ethereumContracts";
import { CollateralAsset } from "@/types/types";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import { getRequestAmount } from "@/utils/contractUtils";
import { ChainName } from "@/enums/Chain";
import { useNotification } from "@/contexts/NotificationProvider";
export const getAppEVMContract = () => {
  let _maxFeePercentage = "5000000000000000";
  let _upperHint = "0x0000000000000000000000000000000000000000";
  let _lowerHint = "0x0000000000000000000000000000000000000000";

  const defaultAsset = DefaultAssetByChainName[ChainName.EVM];
  //console.log("asset", asset);
  const { processLoading, addNotification, setProcessLoading, notification } =
    useNotification();
  const openTrove = async (
    senderAddress: string,
    amount: number,
    loanAmount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.openTrove(
        _maxFeePercentage,
        getRequestAmount(loanAmount, asset.ausdDecimal),
        _upperHint,
        _lowerHint,
        { value: getRequestAmount(amount, asset.decimal) }
      );
      console.log("openTrove", openTrove);
      await tx.wait();
      console.log("tx", tx);
      return await tx;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getTrove = async (borrower: string) => {
    try {
      const { contractWithSigner } = await callTroveManagerContract();
      const getTroveStake = await contractWithSigner.getTroveStake(borrower);
      let res = await getTroveStake;
      console.log("getTroveStake", res);
      const getTroveDebt = await contractWithSigner.getTroveDebt(borrower);
      let res2 = await getTroveDebt;
      console.log("getTroveDebt", res2);

      return {
        collateral_amount: Number(res).toString(),
        debt_amount: Number(res2).toString(),
      };
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const addCollateral = async (
    address: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = DefaultAssetByChainName[ChainName.EVM]
  ) => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.addColl(_upperHint, _lowerHint, {
        value: getRequestAmount(amount, asset.decimal),
      });
      await tx.wait();

      console.log("addColl", tx);
      const hash = tx.transactionHash;
      console.log("hash", hash);

      return hash;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const removeCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.withdrawColl(
        getRequestAmount(amount, asset.decimal),
        _upperHint,
        _lowerHint
      );
      console.log("getRequestAmount", tx);

      await tx.wait();
      const hash = tx.transactionHash;
      console.log("hash", hash);

      return hash;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const closeTrove = async () => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const closeTrove = await contractWithSigner.closeTrove();
      return await closeTrove;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const repayLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    isAllAmount: boolean
  ) => {
    console.log("isAllAmount", isAllAmount);
    
    try {
      let tx;
      console.log("senderAddress", senderAddress);
      if (isAllAmount) {
        
        tx = await closeTrove();
      } else {
        const { contractWithSigner } = await callBorrowerOperationsContract();
        tx = await contractWithSigner.repayAUSD(
          getRequestAmount(amount, defaultAsset.ausdDecimal),
          _upperHint,
          _lowerHint
        );
      }
      await tx.wait();
      return await tx;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const borrowLoan = async (senderAddress: string, amount: number, collRatio: number) => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.withdrawAUSD(_maxFeePercentage, getRequestAmount(amount, defaultAsset.ausdDecimal), _upperHint, _lowerHint);
      await tx.wait();
      return await tx;
  } catch (error) {
      console.log(error);
      return false;
  }
};
  const getAusdBalance = async (borrower: string) => {
    try {
      const { contractWithSigner } = await callAUSDTTokenContract();
      const balanceOf = await contractWithSigner.balanceOf(borrower);
      let data = await balanceOf;
      console.log("balanceOf", data);
      return {
        balance: Number(data).toString(),
      };
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const getStake = async (borrower: string) => {
    try {
      const { contractWithSigner } = await callTroveManagerContract();
      const getTroveStake = await contractWithSigner.getTroveStake(borrower);
      let data = await getTroveStake;
      console.log("getTroveStake", data);

      return {
        amount: Number(data).toString(),
        percentage: _maxFeePercentage,
      };
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  return {
    getTrove,
    getAusdBalance,
    getStake,
    removeCollateral,
    repayLoan,
    borrowLoan,
    /*  getTotalCollateralAmounts,
    getTotalDebtAmount,
    getTotalStake,
    getCollateralPrice,
    getAusdInfo,
    getReward, */
    openTrove,
    addCollateral,
    /*,
    stake,
    unstake,
    redeem,
    liquidateTroves,
    liquidateTrovesV2,
    withdrawLiquidationGains */
  };
};
