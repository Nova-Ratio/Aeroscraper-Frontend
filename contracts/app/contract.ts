import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { coin } from "@cosmjs/proto-signing";
import {
  CW20BalanceResponse,
  CW20TokenInfoResponse,
  GetStakeResponse,
  GetTroveResponseV1,
  GetTroveResponseV2,
} from "./types";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { BaseCoin, CollateralAsset } from "@/types/types";

import { isNil } from "lodash";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { ChainName } from "@/enums/Chain";
import { Chain } from "@chain-registry/types";
import {
  BaseCoinByChainName,
  getContractAddressesByChain,
  priceIdByChainName,
} from "@/constants/chainConstants";

import { DefaultAssetByChainName } from "@/constants/assetConstants";
import graphql from "@/services/graphql";

const updateRewardAmount = 0.01;
const injectivePrivRpc = process.env.NEXT_PUBLIC_INJECTIVE_PRIV_RPC as string;
const injectivePrivGrpc = process.env.NEXT_PUBLIC_INJECTIVE_PRIV_GRPC as string;
const injectivePrivRest = process.env.NEXT_PUBLIC_INJECTIVE_PRIV_REST as string;

export const getAppContract = (
  client: SigningCosmWasmClient,
  baseCoin: BaseCoin,
  chainName: ChainName,
  basePrice: number = 0
) => {
  const defaultAsset = DefaultAssetByChainName[chainName];

  const { contractAddress, ausdContractAddress } = getContractAddressesByChain(chainName);

  const { requestICR, requestRedeemICR } = graphql({
    selectedChainName: ChainName.ARCHWAY,
  });

  //GET QUERIES

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
              : undefined;
        } else {
          // The first node is not the user, so we take it
          next_node_id = data.nextTrove.nodes[0].owner;
        }
      } else if (data.nextTrove.nodes.length === 1) {
        // If there's only one node, we check if it's not the user
        next_node_id =
          data.nextTrove.nodes[0].owner !== user_addr
            ? data.nextTrove.nodes[0].owner
            : undefined;
      } else {
        next_node_id = undefined;
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
        prev_node_id = undefined;
      }
    } catch (err) {
      console.log("FindSortedTroveInsertPosition error", err);
    }

    return { prev_node_id, next_node_id };
  };

  const getTotalCollateralAmounts = async (): Promise<
    TotalCollateralModel[] | undefined
  > => {
    return await client.queryContractSmart(contractAddress, { total_collateral_amounts: {} });
  };

  const getTotalDebtAmount = async (): Promise<string | undefined> => {
    return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
  };

  const getTrove = async (
    user_addr: string
  ): Promise<GetTroveResponseV1 | GetTroveResponseV2 | undefined> => {
    return await client.queryContractSmart(contractAddress, { trove: { user_addr } });
  };

  const getStake = async (
    user_addr: string
  ): Promise<GetStakeResponse | undefined> => {
    return await client.queryContractSmart(contractAddress, { stake: { user_addr } });
  };

  const getTotalStake = async (): Promise<string | undefined> => {
    return await client.queryContractSmart(contractAddress, { total_stake_amount: {} });
  };

  const getCollateralPrice = async () => {
    return await client.queryContractSmart(contractAddress, { collateral_price: {} });
  };

  const getAusdBalance = async (
    address: string
  ): Promise<CW20BalanceResponse | undefined> => {
    return await client.queryContractSmart(ausdContractAddress, { balance: { address } })
  };

  const getAusdInfo = async (): Promise<CW20TokenInfoResponse | undefined> => {
    return await client.queryContractSmart(ausdContractAddress, { token_info: {} })
  };

  const getReward = async (user_addr: string): Promise<string | undefined> => {
    return await client.queryContractSmart(contractAddress, { liquidation_gains: { user_addr } })
  };

  //EXECUTE QUERIES

  const openTrove = async (
    senderAddress: string,
    amount: number,
    loanAmount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {

    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
      collRatio,
      senderAddress
    );

    return await client.execute(
      senderAddress,
      contractAddress,
      {
        open_trove: {
          loan_amount: getRequestAmount(loanAmount, asset.ausdDecimal),
          prev_node_id,
          next_node_id,
        }
      },
      "auto",
      "Open Trove",
      [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
    )
  };

  const addCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {

    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
      collRatio,
      senderAddress
    );

    return await client.execute(
      senderAddress,
      contractAddress,
      {
        add_collateral: {
          prev_node_id,
          next_node_id
        }
      },
      "auto",
      "Add Collateral",
      [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
    )
  };

  const removeCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {

    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
      collRatio,
      senderAddress
    );

    return await client.execute(
      senderAddress,
      contractAddress,
      {
        remove_collateral: {
          collateral_denom: asset.denom,
          collateral_amount: getRequestAmount(amount, asset.decimal),
          prev_node_id,
          next_node_id,
        }
      },
      "auto",
      "Remove Collateral"
    )
  };

  const borrowLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {

    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
      collRatio,
      senderAddress
    );

    return await client.execute(
      senderAddress,
      contractAddress,
      {
        borrow_loan: {
          loan_amount:
            getRequestAmount(amount, baseCoin.ausdDecimal),
          prev_node_id,
          next_node_id,
        }
      },
      "auto",
      "Borrow Loan"
    )
  };

  const repayLoan = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    isAllAmount: boolean,
    asset: CollateralAsset = defaultAsset
  ) => {
    let prev_node_id = null;
    let next_node_id = null;

    if (!isAllAmount) {
      const response = await findSortedTroveInsertPosition(
        collRatio,
        senderAddress
      );
      prev_node_id = response.prev_node_id;
      next_node_id = response.next_node_id;
    }

    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({
          repay_loan: {
            prev_node_id,
            next_node_id,
          },
        }),
      },
    };



    return await client.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      "auto",
      "Repay Loan"
    )
  };

  const stake = async (senderAddress: string, amount: number) => {
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ stake: {} }),
      },
    };

    return client.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      "auto",
      "Stake"
    )
  };

  const unstake = async (senderAddress: string, amount: number) => {
    return await client.execute(
      senderAddress,
      contractAddress,
      { unstake: { amount: getRequestAmount(amount, baseCoin.ausdDecimal) } },
      "auto",
      "Unstake"
    )
  };

  const processRedeemICR = async (amount: string) => {
    let remainingAmount = BigInt(amount);
    let icrdata = (await requestRedeemICR()).troves.nodes.map((i) => {
      return {
        debt: BigInt(i.debtAmount),
        collateral: BigInt(i.collaterals[0].amount.slice(0, -1)),
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

  const redeem = async (
    senderAddress: string,
    amount: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    let prev_node = undefined;
    let next_node = undefined;
    let icr = await processRedeemICR(
      getRequestAmount(amount, baseCoin.ausdDecimal)
    );
    if (icr != 0) {
      const { prev_node_id, next_node_id } =
        await findSortedTroveInsertPosition(icr, senderAddress);
      prev_node = prev_node_id;
      next_node = next_node_id;
    }

    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.decimal),
        msg: jsonToBinary({
          redeem: {
            prev_node_id: prev_node,
            next_node_id: next_node,
          },
        }),
      },
    };



    return await client.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      "auto",
      "Redeem"
    )
  };

  const liquidateTrovesV2 = async (
    senderAddress: string,
    owner: string,
    asset: CollateralAsset = defaultAsset
  ) => {


    const msg = {
      contractAddress,
      sender: senderAddress,
      msg: {
        liquidate_troves: {
          liquidation_list: [owner],
        },
      },
    };

    return await client.execute(
      senderAddress,
      contractAddress,
      msg,
      "auto",
      "Liquidate Troves",
    )
  };

  const updateReward = async (senderAddress: string) => {
    const unstake = {
        unstake: {
          amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal),
        },
    };
    
    const stake = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ stake: {} }),
      },
    };

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress,
          msg: unstake,
        },
        {
          contractAddress: ausdContractAddress,
          msg: stake
        }
      ],
      "auto",
      "Update Reward",
    )
  };

  const withdrawLiquidationGains = async (senderAddress: string) => {
    const msg = {
      contractAddress,
      sender: senderAddress,
      msg: { withdraw_liquidation_gains: {} },
    }

    return await client.execute(
      senderAddress,
      contractAddress,
      msg,
      "auto",
      "Withdraw Liquidation Gains"
    )
  };

  return {
    getTotalCollateralAmounts,
    getTotalDebtAmount,
    getTrove,
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
    liquidateTrovesV2,
    withdrawLiquidationGains,
    updateReward,
  };
};
