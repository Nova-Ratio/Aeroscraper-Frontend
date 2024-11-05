import { ethers } from "ethers";
import {
  callBorrowerOperationsContract,
  callTroveManagerContract,
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
import {
  callCirculatedTotalSupply,
  callClaimReward,
  callGetNICR,
  callGetStake,
  callGetTroveColl,
  callGetTroveDebt,
  callLiquidate,
  callStakeShare,
  callOpenTrove,
  calculateNewPositionAndNICR,
  callAddColl,
  callWithdrawColl,
  callRepayAUSD,
  callWithdrawAUSD,
  callRedeemCollateral,
  callBalanceOfReward,
} from "./useAppContracts";
import graphql from "@/services/graphql";
export const getAppEVMContract = () => {
  let _maxFeePercentage = "999990000000000000";
  let _maxIterations = 6;
  const defaultAddress = "0x0000000000000000000000000000000000000000";

  // Indexer data should be deleted
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
      console.log("data", data);

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

  const processRedeemICR = async (amount: string, senderAddress: string) => {
    let NICR_PRECISION = 10 ** 20;
    let NICR = 0;
    let remainingAmount = BigInt(amount);
    let requestRedeem = await requestRedeemICR();
    let icrdata: any[] = await Promise.all(
      requestRedeem.troves.nodes.map(async (i: any) => {
        console.log("i", i.debtAmount, i.collaterals);
        const trove = await getTrove(i.owner);
        return {
          debt: BigInt(Number(trove?.debt_amount || 0)), // i.debtAmount
          collateral: BigInt(Number(trove?.collateral_amount || 0)), //i.collaterals
          owner: i.owner,
        };
      })
    );
    console.log("icrdata", icrdata);
    let firstAddress = icrdata[0].owner;
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
    let lowerHint =
      selectedidx !== 0 ? defaultAddress : icrdata[selectedidx].owner;
    let upperHint =
      icrdata[
        selectedidx !== icrdata.length - 1 ? selectedidx + 1 : selectedidx
      ].owner;
    /* remainingAmount = icrdata[selectedidx].debt - remainingAmount; */
    let lastAddress = icrdata[selectedidx].owner;
    console.log(
      "remainingAmount",
      remainingAmount,
      firstAddress,
      icrdata[selectedidx].debt,
      lowerHint,
      upperHint
    );

    NICR = await callGetNICR(
      lastAddress,
      remainingAmount
    );
    console.log("NICR", NICR);

    return { NICR: NICR, firstAddress, lowerHint, upperHint };
  };
  const defaultAsset = DefaultAssetByChainName[ChainName.AVAX];
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
      const helpers = await calculateNewPositionAndNICR(senderAddress, getRequestAmount(loanAmount, asset.ausdDecimal), getRequestAmount(amount, asset.decimal), true, false, false)
      const upperHint = helpers?.next || defaultAddress;
      const lowerHint = helpers?.prev || defaultAddress;
      console.log("UpperHint: ", upperHint);
      console.log("LowerHint: ", lowerHint);
      const tx = await callOpenTrove(senderAddress, getRequestAmount(loanAmount, asset.ausdDecimal), upperHint, lowerHint, getRequestAmount(amount, asset.decimal));
      await tx.wait();
      console.log("openTrove", tx);
      console.log("tx", tx);

      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      return error;
    }
  };
  const getTrove = async (borrower: string) => {
    try {
      const getStake = await callGetTroveColl(borrower);
      let res = await getStake;

      const getTroveDebt = await callGetTroveDebt(borrower);
      let res2 = await getTroveDebt;

      return {
        collateral_amount: Number(res).toString(),
        debt_amount: Number(res2).toString(),
      };
    } catch (error) {
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

      const helpers = await calculateNewPositionAndNICR(address, 0, getRequestAmount(amount, asset.decimal), false, false, true);
      const upperHint = helpers?.next || defaultAddress;
      const lowerHint = helpers?.prev || defaultAddress;
      console.log("amount", getRequestAmount(amount, asset.decimal));
      console.log("upperHint", upperHint);
      console.log("lowerHint", lowerHint);

      const tx = await callAddColl(getRequestAmount(amount, asset.decimal), upperHint, lowerHint);
      await tx.wait();
      const hash = tx.hash;

      return {
        txHash: hash,
      };
    } catch (error: any) {
      console.log(error?.message);
      return error;
    }
  };

  const removeCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    try {
      const helpers = await calculateNewPositionAndNICR(senderAddress, 0, getRequestAmount(amount, asset.decimal), false, false, false);
      const upperHint = helpers?.next || defaultAddress;
      const lowerHint = helpers?.prev || defaultAddress;
      const tx = await callWithdrawColl(getRequestAmount(amount, asset.decimal), upperHint, lowerHint);
      await tx.wait();
      console.log("getRequestAmount", tx);
      const hash = tx.hash;
      console.log("hash", hash);
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const closeTrove = async () => {
    try {
      const { contractWithSigner } = await callBorrowerOperationsContract();
      const tx = await contractWithSigner.closeTrove();
      await tx.wait();
      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const repayLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    isAllAmount: boolean,
    //Price data is ready to be used as a parameter @tuggun
    denomPrice: number
  ) => {
    console.log("isAllAmount", isAllAmount);

    try {
      let tx;
      let hash = "";
      console.log("senderAddress", senderAddress);
      const { contractWithSigner } = await callBorrowerOperationsContract();
      if (isAllAmount) {
        tx = await contractWithSigner.closeTrove();
        await tx.wait();
        hash = tx.hash;
      } else {
        const helpers = await calculateNewPositionAndNICR(senderAddress, getRequestAmount(amount, defaultAsset.ausdDecimal), 0, false, false, false);
        const upperHint = helpers?.next || defaultAddress;
        const lowerHint = helpers?.prev || defaultAddress;
        tx = await callRepayAUSD(getRequestAmount(amount, defaultAsset.ausdDecimal), upperHint, lowerHint);
        await tx.wait();
        hash = tx.hash;
      }

      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const borrowLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number
  ) => {
    try {
      const helpers = await calculateNewPositionAndNICR(senderAddress, getRequestAmount(amount, defaultAsset.ausdDecimal), 0, false, true, false);
      const upperHint = helpers?.next || defaultAddress;
      const lowerHint = helpers?.prev || defaultAddress;
      const tx = await callWithdrawAUSD(getRequestAmount(amount, defaultAsset.ausdDecimal), upperHint, lowerHint);
      await tx.wait();
      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
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
      const getTroveStake = await callGetStake(borrower);
      let data = await getTroveStake;
      let percentage = await callStakeShare(borrower);
      console.log("callGetStake", data);
      return {
        amount: Number(data).toString(),
        percentage: percentage,
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
      const tx = await contractWithSigner.getEntireSystemColl();
      console.log("getTotalCollateralAmounts", tx);
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
      const { contractWithSigner } = await callTroveManagerContract();
      const entireSystemDebt = await contractWithSigner.getEntireSystemDebt();
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
      return undefined;
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
      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const unstake = async (senderAddress: string, amount: number) => {
    try {
      const { contractWithSigner } = await callAUSDStakingContract();
      const tx = await contractWithSigner.unstake(
        getRequestAmount(amount, defaultAsset.decimal)
      );
      await tx.wait();
      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  //This function is triggered from UI @tuggun
  const redeem = async (senderAddress: string, amount: number) => {
    try {
      console.log("redeemCollateral", getRequestAmount(amount, defaultAsset.decimal));;
      const tx = await callRedeemCollateral(senderAddress,getRequestAmount(amount, defaultAsset.decimal), 10);
      
      const hash = tx.hash;
      return {
        txHash: hash,
      };
      /* 
      let _lowerPartialRedemptionHint = defaultAddress;
      let _upperPartialRedemptionHint = defaultAddress;
      let converAmount = getRequestAmount(amount, defaultAsset.ausdDecimal);
      console.log("converAmount", converAmount, amount);

      let processRedeem = await processRedeemICR(converAmount, senderAddress);
      console.log("NICR", processRedeem?.NICR);

      if (processRedeem?.NICR != 0) {
        const { prev_node_id, next_node_id } =
          await findSortedTroveInsertPosition(
            Number(processRedeem?.NICR),
            senderAddress
          );
        _lowerPartialRedemptionHint = prev_node_id || defaultAddress;
        _upperPartialRedemptionHint = next_node_id || defaultAddress;
      }
      const { contractWithSigner } = await callTroveManagerContract();
      console.log(
        "redeemCollateral",
        getRequestAmount(amount, defaultAsset.decimal),
        processRedeem?.firstAddress,
        processRedeem?.lowerHint || defaultAddress, //_lowerPartialRedemptionHint,
        processRedeem?.upperHint || defaultAddress, //_upperPartialRedemptionHint
        processRedeem?.NICR || 0,
        _maxIterations
      );

      const tx = await contractWithSigner.redeemCollateral(
        getRequestAmount(amount, defaultAsset.decimal),
        processRedeem?.firstAddress,
        processRedeem?.lowerHint || defaultAddress, // _lowerPartialRedemptionHint,
        processRedeem?.upperHint || defaultAddress, //_upperPartialRedemptionHint
        processRedeem?.NICR || "0",
        _maxIterations
      );
      await tx.wait();
      const hash = tx.hash;
      return {
        txHash: hash,
      };
     */
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const liquidateTroves = async (senderAddress: string) => {
    try {
      const tx = await callLiquidate(senderAddress)
      //await tx.wait();
      const hash = tx.hash;
      return {
        txHash: hash,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getAusdInfo = async (): Promise<number | undefined> => {
    try {
      const circulatedTotalSupply = await callCirculatedTotalSupply();
      console.log("circulatedTotalSupply", circulatedTotalSupply);
      return await circulatedTotalSupply;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const getReward = async (user_addr: string): Promise<string | undefined> => {
    try {
      let res = await callBalanceOfReward(user_addr);
      console.log("callClaimReward", res);
      return res;
    } catch (error) {

      return undefined;
    }
  };
  const withdrawLiquidationGains = async (senderAddress: string) => {
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
  };
};
