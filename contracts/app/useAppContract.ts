import { useCallback, useMemo } from "react";
import { isNil } from "lodash";
import useChainAdapter from "@/hooks/useChainAdapter";
import { WalletType } from "@/enums/WalletType";
import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";
import { getAppEVMContract } from "@/evmContractInteractions/contract";

const useAppContract = () => {
  const {
    isWalletConnected,
    baseCoin,
    walletInfo,
    selectedChainName,
    address,
    chain,
    basePrice,
  } = useChainAdapter();

  const contract = useMemo(
    () =>
      isWalletConnected &&
      !isNil(baseCoin) &&
      !isNil(walletInfo) &&
      !isNil(selectedChainName) &&
      !isNil(chain)
        ? getAppEVMContract({
            basePrice,
          })
        : undefined,
    [
      isWalletConnected,
      baseCoin,
      walletInfo,
      selectedChainName,
      chain,
      basePrice,
    ]
  );
  //console.log("selectedChainName", selectedChainName);

  const getTotalCollateralAmounts = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalCollateralAmounts();
  }, [contract]);

  const getTotalDebtAmount = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalDebtAmount();
  }, [contract]);

  const getTrove = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.getTrove(address);
  }, [address, contract]);

  const getTroveByAddress = useCallback(
    async (address: string) => {
      if (isNil(contract)) return;
      return await contract.getTrove(address);
    },
    [contract]
  );

  const getStake = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.getStake(address);
  }, [address, contract]);

  const getTotalStake = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getTotalStake();
  }, [contract]);

  const getCollateralPrice = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getCollateralPrice();
  }, [contract]);

  const getAusdBalance = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.getAusdBalance(address);
  }, [address, contract]);

  const getAusdInfo = useCallback(async () => {
    if (isNil(contract)) return;
    return await contract.getAusdInfo();
  }, [contract]);

  const getReward = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.getReward(address);
  }, [address, contract]);

  const openTrove = useCallback(
    async (
      amount: number,
      loan_amount: number,
      collRatio: number,
      asset?: CollateralAsset
    ) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.openTrove(
        address,
        amount,
        loan_amount,
        collRatio,
        asset
      );
    },
    [address, contract]
  );

  const addCollateral = useCallback(
    async (amount: number, collRatio: number, asset?: CollateralAsset) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.addCollateral(address, amount, collRatio, asset);
    },
    [address, contract]
  );

  const removeCollateral = useCallback(
    async (amount: number, collRatio: number, asset?: CollateralAsset) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.removeCollateral(address, amount, collRatio, asset);
    },
    [address, contract]
  );

  const borrowLoan = useCallback(
    async (amount: number, collRatio: number) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.borrowLoan(address, amount, collRatio);
    },
    [address, contract]
  );

  const repayLoan = useCallback(
    async (amount: number, collRatio: number, isAllAmount: boolean) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.repayLoan(address, amount, collRatio, isAllAmount);
    },
    [address, contract]
  );

  const stake = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.stake(address, amount);
    },
    [address, contract]
  );

  const unstake = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.unstake(address, amount);
    },
    [address, contract]
  );

  const redeem = useCallback(
    async (amount: number) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.redeem(address, amount);
    },
    [address, contract]
  );

  const liquidateTroves = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.liquidateTroves(address);
  }, [address, contract]);

  const liquidateTrovesV2 = useCallback(
    async (owner: string) => {
      /* if (isNil(contract) || isNil(address)) return;
      return await contract.liquidateTrovesV2(address, owner); */
      return undefined;
    },
    [address, contract]
  );

  const withdrawLiquidationGains = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.withdrawLiquidationGains(address);
  }, [address, contract]);

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
