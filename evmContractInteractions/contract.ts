import { ethers } from "ethers";
import {
  callBorrowerOperationsContract,
  callTroveManagerContract,
  callStabilityPoolContract,
  callAUSDTTokenContract,
  callPriceFeedContract,
  callAUSDStakingContract,
} from "./ethereumContracts";
import { CollateralAsset } from "@/types/types";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import { getRequestAmount } from "@/utils/contractUtils";
import { ChainName } from "@/enums/Chain";
import { useNotification } from "@/contexts/NotificationProvider";
import { TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { CW20TokenInfoResponse } from "@/contracts/app/types";
import graphql from "@/services/graphql";
export const getAppEVMContract = ({ basePrice }: { basePrice: number }) => {
  let _maxFeePercentage = "5000000000000000";
  let _maxIterations = 2;
  const defaultAddress = "0x0000000000000000000000000000000000000000";
  console.log("basePrice", basePrice);

  const { requestICR, requestRedeemICR } = graphql({
    selectedChainName: ChainName.EVM,
  });
  const findSortedTroveInsertPosition = async (
    collRatio: number,
    user_addr: string
  ): Promise<{
    prev_node_id: string | undefined;
    next_node_id: string | undefined;
  }> => {
    let next_node_id;
    let prev_node_id;

    try {
      
      const data = await requestICR(collRatio * 100);
      if (data.nextTrove.nodes.length === 2) {
        if (data.nextTrove.nodes[0].owner === user_addr) {
          // Skip the first node and check the second
          next_node_id =
            data.nextTrove.nodes[1].owner !== user_addr
              ? data.nextTrove.nodes[1].owner
              : defaultAddress;
        } else {
          // The first node is not the user, so we take it
          next_node_id = data.nextTrove.nodes[0].owner;
        }
      } else if (data.nextTrove.nodes.length === 1) {
        // If there's only one node, we check if it's not the user
        next_node_id =
          data.nextTrove.nodes[0].owner !== user_addr
            ? data.nextTrove.nodes[0].owner
            : defaultAddress;
      } else {
        next_node_id = defaultAddress;
      }

      if (data.prevTrove.nodes.length === 2) {
        prev_node_id = data.prevTrove.nodes.find(
          (node) => node.owner !== user_addr
        )?.owner;
      } else if (
        data.prevTrove.nodes.length === 1 &&
        data.prevTrove.nodes[0].owner !== user_addr
      ) {
        prev_node_id = data.prevTrove.nodes[0].owner;
      } else {
        prev_node_id = defaultAddress;
      }
    } catch (err) {
      console.log("FindSortedTroveInsertPosition error", err);
    }

    return { prev_node_id, next_node_id };
  };
  const processRedeemICR = async (amount: string) => {
    let remainingAmount = BigInt(amount);
    let icrdata = (await requestRedeemICR()).troves.nodes.map((i:any) => {
      console.log("i", i.debtAmount, i.collaterals);
      
      return {
        debt: BigInt(i.debtAmount),
        collateral: BigInt(i.collaterals),//i.collaterals?.slice(0, -1)
      };
    });
    let selectedidx = 0;
    for (let idx in icrdata) {
      let trove = icrdata[idx];
      if (remainingAmount > trove.debt) {
        remainingAmount -= trove.debt;
      } else {
        selectedidx = Number(idx);
        break;
      }
    }
    let troveDebt = icrdata[selectedidx].debt - remainingAmount;
    if (Number(troveDebt) === 0) return 0;
    let collateraltodecrease = BigInt(Number(remainingAmount) / basePrice);
    let troveCollateral =
      icrdata[selectedidx].collateral - collateraltodecrease;
    return Number(troveCollateral) / Number(troveDebt);
  };
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
      const { prev_node_id: _lowerHint, next_node_id: _upperHint } =
        await findSortedTroveInsertPosition(collRatio, senderAddress);
      console.log("openTrove", _lowerHint, _upperHint);

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
      return undefined;
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
      const { prev_node_id: _lowerHint, next_node_id: _upperHint } =
        await findSortedTroveInsertPosition(collRatio, address);
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
      return undefined;
    }
  };

  const removeCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    try {
      const { prev_node_id: _lowerHint, next_node_id: _upperHint } =
        await findSortedTroveInsertPosition(collRatio, senderAddress);
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
        const { prev_node_id: _lowerHint, next_node_id: _upperHint } =
        await findSortedTroveInsertPosition(collRatio, senderAddress);
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
  const borrowLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number
  ) => {
    try {
      const { prev_node_id: _lowerHint, next_node_id: _upperHint } =
        await findSortedTroveInsertPosition(collRatio, senderAddress);
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.withdrawAUSD(
        _maxFeePercentage,
        getRequestAmount(amount, defaultAsset.ausdDecimal),
        _upperHint,
        _lowerHint
      );
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
  const getTotalCollateralAmounts = async (): Promise<
    TotalCollateralModel[] | undefined
  > => {
    try {
      const { contractWithSigner } = await callTroveManagerContract();
      const tx = await contractWithSigner.entireSystemColl();
      await tx.wait();
      let res = await tx;
      return [
        {
          amount: Number(res),
          denom: "eth",
        },
      ];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const getTotalDebtAmount = async (): Promise<string | undefined> => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const entireSystemDebt = await contractWithSigner.entireSystemDebt();
      return await entireSystemDebt;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const getTotalStake = async (): Promise<string | undefined> => {
    try {
      const { contractWithSigner } = await callAUSDStakingContract();
      const getTotalAUSDStaked = await contractWithSigner.getTotalAUSDStaked();
      return await getTotalAUSDStaked;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const getCollateralPrice = async () => {
    try {
      const { contractWithSigner } = await callPriceFeedContract();
      const fetchPrice = await contractWithSigner.fetchPrice();
      return await fetchPrice;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const stake = async (senderAddress: string, amount: number) => {
    try {
      console.log("amount :", amount);
      console.log(
        "amountDecimals :",
        getRequestAmount(amount, defaultAsset.decimal)
      );
      let _amount = getRequestAmount(amount, defaultAsset.decimal);
      let spender = (await callAUSDStakingContract()).Address;
      let owner = senderAddress;
      let checker = await (
        await callAUSDTTokenContract()
      ).contractWithSigner.allowance(owner, spender);
      if (checker < _amount) {
        let tx = await (
          await callAUSDTTokenContract()
        ).contractWithSigner.approve(spender, _amount);
        await tx.wait();
      }

      const { contractWithSigner } = await callAUSDStakingContract();
      const tx = await contractWithSigner.stake(_amount);
      await tx.wait();
      let res = await tx;
      return res;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const unstake = async (senderAddress: string, amount: number) => {
    try {
      const { contractWithSigner } = await callAUSDStakingContract();
      const tx = await contractWithSigner.unstake(
        getRequestAmount(amount, defaultAsset.decimal)
      );
      await tx.wait();
      let res = await tx;
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const redeem = async (senderAddress: string, amount: number) => {
    try {
      let _lowerPartialRedemptionHint = defaultAddress;
      let _upperPartialRedemptionHint = defaultAddress;
      let _partialRedemptionHintNICR = await processRedeemICR(
        getRequestAmount(amount, defaultAsset.ausdDecimal)
      );
      if (_partialRedemptionHintNICR != 0) {
        const { prev_node_id, next_node_id } =
          await findSortedTroveInsertPosition(_partialRedemptionHintNICR, senderAddress);
          _lowerPartialRedemptionHint = prev_node_id || defaultAddress;
          _upperPartialRedemptionHint = next_node_id || defaultAddress;
      }
      const { contractWithSigner } = await callTroveManagerContract();
      console.log("redeemCollateral",  getRequestAmount(amount, defaultAsset.decimal), senderAddress, _upperPartialRedemptionHint, _lowerPartialRedemptionHint, "icr", getRequestAmount(_partialRedemptionHintNICR,defaultAsset.decimal) || 0, _maxIterations, _maxFeePercentage);
      
      const tx = await contractWithSigner.redeemCollateral(
        getRequestAmount(amount, defaultAsset.decimal),
        senderAddress,
        _upperPartialRedemptionHint,
        _lowerPartialRedemptionHint,
        getRequestAmount(_partialRedemptionHintNICR,defaultAsset.decimal) || 0,
        _maxIterations,
        _maxFeePercentage
      );
      await tx.wait();
      let res = await tx;
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const liquidateTroves = async (senderAddress: string, n = 5) => {
    try {
      const { contractWithSigner } = await callTroveManagerContract();
      const tx = await contractWithSigner.liquidateTroves(n); // TODO: tuğgüne sor
      await tx.wait();
      let res = await tx;
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getAusdInfo = async (): Promise<CW20TokenInfoResponse | undefined> => {
    /* const res = await chainGrpcWasmApi.fetchSmartContractState(
      ausdContractAddress,
      toBase64({ token_info: {} })
    );
    const data: any = fromBase64(res.data as any);
    return data; */
    return undefined;
  };
  const getReward = async (user_addr: string): Promise<string | undefined> => {
    /* const res = await chainGrpcWasmApi.fetchSmartContractState(
      contractAddress,
      toBase64({ liquidation_gains: { user_addr } })
    );
    const data: any = fromBase64(res.data as any);
    return data; */
    return undefined;
  };
  const withdrawLiquidationGains = async (senderAddress: string) => {
    /* const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress,
      sender: senderAddress,
      msg: { withdraw_liquidation_gains: {} }
    })

    return await msgBroadcastClient.broadcast({
      msgs: msg,
      injectiveAddress: senderAddress,      
    }) */
    return undefined;
  };
  return {
    getTrove,
    getAusdBalance,
    getStake,
    removeCollateral,
    repayLoan,
    borrowLoan,
    getTotalCollateralAmounts,
    getTotalDebtAmount,
    getCollateralPrice,
    getTotalStake,
    openTrove,
    addCollateral,
    unstake,
    stake,
    redeem,
    liquidateTroves,
    getAusdInfo,
    getReward,
    withdrawLiquidationGains,
    /*,
     */
  };
};
