import { useCallback, useMemo } from "react";
import { isNil } from "lodash";
import { WalletType } from "@/enums/WalletType";
import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";
import { useAppContext } from "@/contexts/AppProvider";
import { getAppContract } from "./contract";

const useAppContract = () => {
  const {
    isConnected,
    baseCoin,
    walletInfo,
    selectedChainName,
    userInfo,
    chainInfo,
    basePrice
  } = useAppContext();

  const contract = useMemo(
    () =>
      isConnected &&
        !isNil(baseCoin) &&
        !isNil(walletInfo) &&
        !isNil(selectedChainName) &&
        !isNil(chainInfo)
        ? getAppContract(userInfo, baseCoin, selectedChainName ?? ChainName.HEDERA, walletInfo.name as WalletType, basePrice)
        : undefined,
    [
      isConnected,
      baseCoin,
      walletInfo,
      selectedChainName,
      chainInfo,
      basePrice,
    ]
  );

  const getTotalCollateralAmounts = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalCollateralAmounts();
  }, [contract]);

  const getTotalDebtAmount = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalDebtAmount();
  }, [contract]);

  const getTrove = useCallback(async () => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.getTrove(userInfo.address);
  }, [userInfo.address, contract]);

  const getTroveByAddress = useCallback(
    async (address: string) => {
      if (isNil(contract)) return;
      return await contract.getTrove(address);
    },
    [contract]
  );

  const getStake = useCallback(async () => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.getStake(userInfo.address);
  }, [userInfo.address, contract]);

  const getTotalStake = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalStake();
  }, [contract]);

  const getCollateralPrice = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getCollateralPrice();
  }, [contract]);

  const getAusdBalance = useCallback(async () => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.getAusdBalance(userInfo.address);
  }, [userInfo.address, contract]);

  const getAusdInfo = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getAusdInfo();
  }, [contract]);

  const getReward = useCallback(async () => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.getReward(userInfo.address);
  }, [userInfo.address, contract]);

  const openTrove = useCallback(
    async (
      amount: number,
      loan_amount: number,
      collRatio: number,
      asset?: CollateralAsset
    ) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.openTrove(
        userInfo.address,
        amount,
        loan_amount,
        collRatio,
        asset
      );
    },
    [userInfo.address, contract]
  );

  const addCollateral = useCallback(
    async (amount: number, collRatio: number, asset?: CollateralAsset) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.addCollateral(userInfo.address, amount, collRatio, asset);
    },
    [userInfo.address, contract]
  );

  const removeCollateral = useCallback(
    async (amount: number, collRatio: number, asset?: CollateralAsset) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.removeCollateral(userInfo.address, amount, collRatio, asset);
    },
    [userInfo.address, contract]
  );

  const borrowLoan = useCallback(
    async (amount: number, collRatio: number) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.borrowLoan(userInfo.address, amount, collRatio);
    },
    [userInfo.address, contract]
  );

  const repayLoan = useCallback(
    async (amount: number, collRatio: number, isAllAmount: boolean) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.repayLoan(userInfo.address, amount, collRatio, isAllAmount);
    },
    [userInfo.address, contract]
  );

  const stake = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.stake(userInfo.address, amount);
    },
    [userInfo.address, contract]
  );

  const unstake = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.unstake(userInfo.address, amount);
    },
    [userInfo.address, contract]
  );

  const redeem = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.redeem(userInfo.address, amount);
    },
    [userInfo.address, contract]
  );

  const liquidateTroves = useCallback(async (owner: string) => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.liquidateTroves(owner);
  }, [userInfo.address, contract]);

  const liquidateTrovesV2 = useCallback(
    async (owner: string) => {
      /* if (isNil(contract) || isNil(userInfo.address)) return;
      return await contract.liquidateTrovesV2(userInfo.address, owner); */
      return undefined;
    },
    [userInfo.address, contract]
  );

  const withdrawLiquidationGains = useCallback(async () => {
    if (isNil(contract) || isNil(userInfo.address)) return;
    return await contract.withdrawLiquidationGains(userInfo.address);
  }, [userInfo.address, contract]);

  const value = useMemo(
    () => ({
      getTotalCollateralAmounts,
      getTotalDebtAmount,
      getTrove,
      getTroveByAddress,
      getStake,
      getTotalStake,
      getCollateralPrice,
      getAusdBalance,
      getAusdInfo,
      getReward,
      openTrove,
      addCollateral,
      removeCollateral,
      borrowLoan,
      repayLoan,
      stake,
      unstake,
      redeem,
      liquidateTroves,
      liquidateTrovesV2,
      withdrawLiquidationGains,
    }),
    [
      getTotalCollateralAmounts,
      getTotalDebtAmount,
      getTrove,
      getTroveByAddress,
      getStake,
      getTotalStake,
      getCollateralPrice,
      getAusdBalance,
      getAusdInfo,
      getReward,
      openTrove,
      addCollateral,
      removeCollateral,
      borrowLoan,
      repayLoan,
      stake,
      unstake,
      redeem,
      liquidateTroves,
      liquidateTrovesV2,
      withdrawLiquidationGains,
    ]
  );

  return value;
};

export default useAppContract;
