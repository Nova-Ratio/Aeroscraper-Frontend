import { useCallback, useMemo } from "react";
import { isEmpty, isNil } from "lodash";
import useChainAdapter from "@/hooks/useChainAdapter";
import { CollateralAsset } from "@/types/types";
import { useAbstraxionSigningClient } from "@/hooks/xion";
import { getXionContract } from "./getXionContract";

const useAppContract = () => {
  const {
    isWalletConnected,
    baseCoin,
    address,
  } = useChainAdapter();
  const { client: abstraxionClient } = useAbstraxionSigningClient();

  const contract = useMemo(
    () =>
      isWalletConnected && !isNil(baseCoin) && !isNil(abstraxionClient) && !isNil(address)
        ? getXionContract(abstraxionClient, baseCoin, address)
        : undefined,
    [
      isWalletConnected,
      baseCoin,
      abstraxionClient,
      address
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
    async (amount: number, loan_amount: number, collRatio: number, asset?: CollateralAsset) => {
      if (isNil(contract) || isNil(address)) return;
      return await contract.openTrove(address, amount, loan_amount, collRatio, asset);
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
      console.log("contract", contract, address, amount);

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
      if (isNil(contract) || isNil(address)) return;
      return await contract.liquidateTrovesV2(address, owner);
    },
    [address, contract]
  );

  const withdrawLiquidationGains = useCallback(async () => {
    if (isNil(contract) || isNil(address)) return;
    return await contract.withdrawLiquidationGains(address);
  }, [address, contract]);

  const mint = useCallback(
    async (amount?: number) => {
      if (isNil(contract) || isNil(address)) return;
      if ("mint" in contract) {
        return await contract.mint(address, amount);
      } else {
        return;
      }
    },
    [address, contract]
  )

  const getPrice = useCallback(async () => {
    if (isNil(contract)) return;

    if ("getPrice" in contract) {
      const result = await contract.getPrice();
      return result;
    }

    return;

  }, [contract]);

  const getTroveCount = useCallback(async () => {
    if (isNil(contract)) return;

    if ("getTroveCount" in contract) {
      const result = await contract.getTroveCount();
      return result;
    }
    return;
  }, [contract]);

  const getCustomTokenBalance = useCallback(
    async () => {
      if (isNil(contract) || isNil(address)) return;
      if ("getCustomTokenBalance" in contract) {
        return await contract.getCustomTokenBalance(address);
      } else {
        return;
      }
    },
    [address, contract]
  )

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
      getCustomTokenBalance,
      getPrice,
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
      mint,
      getTroveCount,
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
      getCustomTokenBalance,
      getPrice,
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
      mint,
      getTroveCount,
    ]
  );

  return value;
};

export default useAppContract;
