import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/proto-signing";
import {
  CW20BalanceResponse,
  CW20TokenInfoResponse,
  GetStakeResponse,
  GetTroveResponseV1,
  GetTroveResponseV2,
} from "./types";
import {
  AbstractionClient,
  AppVersion,
  BaseCoin,
  CollateralAsset,
} from "@/types/types";
import { TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { ChainName } from "@/enums/Chain";
import { getContractAddressesByChain } from "@/constants/chainConstants";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import graphql from "@/services/graphql";
import { usePrice } from "@/contexts/PriceProvider";

const updateRewardAmount = 0.01;

export const getXionContract = (
  client: AbstractionClient,
  baseCoin: BaseCoin,
  userAddress: string
) => {
  const defaultAsset = DefaultAssetByChainName[ChainName.XION];
  const {
    contractAddress,
    oraclecontractAddress,
    customTokenMinter,
    ausdContractAddress,
    cw20CustomToken,
  } = getContractAddressesByChain(AppVersion.V2, ChainName.XION);
  const { coinPricesByDenom } = usePrice();

  const { requestICR, requestRedeemICR } = graphql({ selectedChainName: ChainName.XION });

  const getTotalCollateralAmounts = async (): Promise<
    TotalCollateralModel | undefined
  > => {
    return await client?.queryContractSmart(contractAddress, {
      total_collateral_amounts: {},
    });
  };

  const getTotalDebtAmount = async (): Promise<string> => {
    return await client?.queryContractSmart(contractAddress, {
      total_debt_amount: {},
    });
  };

  const getTrove = async (
    user_addr: string
  ): Promise<GetTroveResponseV1 | GetTroveResponseV2> => {
    return await client?.queryContractSmart(contractAddress, {
      trove: { user_addr },
    });
  };

  const getStake = async (user_addr: string): Promise<GetStakeResponse> => {
    return await client?.queryContractSmart(contractAddress, {
      stake: { user_addr },
    });
  };

  const getTotalStake = async (): Promise<string> => {
    return await client?.queryContractSmart(contractAddress, {
      total_stake_amount: {},
    });
  };

  const getCollateralPrice = async () => {
    return await client?.queryContractSmart(contractAddress, {
      collateral_price: {},
    });
  };

  const getAusdBalance = async (
    address: string
  ): Promise<CW20BalanceResponse> => {
    let balance = await client?.queryContractSmart(ausdContractAddress, {
      balance: { address },
    });
    return balance;
  };
  const getCustomTokenBalance = async (
    address: string
  ): Promise<CW20BalanceResponse> => {
    return await client?.queryContractSmart(cw20CustomToken as string, {
      balance: { address },
    });
  };

  const getAusdInfo = async (): Promise<CW20TokenInfoResponse> => {
    return await client?.queryContractSmart(ausdContractAddress, {
      token_info: {},
    });
  };

  const getReward = async (user_addr: string): Promise<string> => {
    return await client?.queryContractSmart(contractAddress, {
      liquidation_gains: { user_addr },
    });
  };

  const getPrice = async (): Promise<any> => {
    return await client?.queryContractSmart(oraclecontractAddress, {
      prices: {},
    })
  }

  const getTroveCount = async (): Promise<any> => {
    return await client?.queryContractSmart(contractAddress, {
      trove_count: {},
    })
  }

  const FindSortedTroveInsertPosition = async (collRatio: number): Promise<{ prev_node_id: string | undefined, next_node_id: string | undefined }> => {
    let next_node_id
    let prev_node_id
    let user_addr = userAddress

    try {
      const data = await requestICR(collRatio * 100);
      if (data.nextTrove.nodes.length === 2) {
        if (data.nextTrove.nodes[0].owner === user_addr) {
          // Skip the first node and check the second
          next_node_id = data.nextTrove.nodes[1].owner !== user_addr ? data.nextTrove.nodes[1].owner : undefined;
        } else {
          // The first node is not the user, so we take it
          next_node_id = data.nextTrove.nodes[0].owner;
        }
      } else if (data.nextTrove.nodes.length === 1) {
        // If there's only one node, we check if it's not the user
        next_node_id = data.nextTrove.nodes[0].owner !== user_addr ? data.nextTrove.nodes[0].owner : undefined;
      } else {
        next_node_id = undefined;
      }

      if (data.prevTrove.nodes.length === 2) {
        prev_node_id = data.prevTrove.nodes.find(node => node.owner !== user_addr)?.owner;
      } else if (data.prevTrove.nodes.length === 1 && data.prevTrove.nodes[0].owner !== user_addr) {
        prev_node_id = data.prevTrove.nodes[0].owner;
      } else {
        prev_node_id = undefined;
      }
    }
    catch (err) {
      console.log("FindSortedTroveInsertPosition error", err);
    }

    return { prev_node_id, next_node_id };
  }
  //EXECUTE QUERIES
  // bu hariç
  const mint = async (senderAddress: string, amount?: number) => {
    return await client?.execute(
      senderAddress,
      customTokenMinter as string,
      {
        mint: {},
      },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "250000",
      },
      "customtokenminter"
    );
  };
  function getMsg(
    amount: number,
    asset: CollateralAsset = defaultAsset,
    msg: any
  ) {
    return {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, asset.decimal),
        msg: jsonToBinary(
          msg,
        ),
      },
    };
  }

  const openTrove = async (
    senderAddress: string,
    amount: number,
    loanAmount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset,
  ) => {
    const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(collRatio);

    const msg = getMsg(amount, asset, {
      open_trove: {
        loan_amount: getRequestAmount(loanAmount, asset.ausdDecimal),
        prev_node_id,
        next_node_id
      },
    });

    return await client?.execute(
      senderAddress,
      cw20CustomToken as string,
      msg,
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Open Trove"
    );
  };

  const addCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {

    const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(collRatio);
    const msg = getMsg(amount, asset, { add_collateral: { prev_node_id, next_node_id } });
    return await client?.execute(
      senderAddress,
      cw20CustomToken as string,
      msg,
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Add Collateral"
    );
  };

  const removeCollateral = async (
    senderAddress: string,
    amount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(collRatio);
    return await client?.execute(
      senderAddress,
      contractAddress,
      {
        remove_collateral: {
          collateral_amount: getRequestAmount(amount, asset.decimal),
          collateral_denom: asset.cw20Denom,
          prev_node_id,
          next_node_id
        },
      },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Remove Collateral"
    );
  };


  const borrowLoan = async (senderAddress: string, amount: number, collRatio: number) => {

    const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(collRatio);
    return await client?.execute(
      senderAddress,
      contractAddress,
      {
        borrow_loan: {
          loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal),
          prev_node_id,
          next_node_id
        },
      },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Borrow Loan"
    );
  };

  const repayLoan = async (senderAddress: string, amount: number, collRatio: number, isAllAmount: boolean) => {

    const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(collRatio);

    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({
          repay_loan: {
            prev_node_id: isAllAmount ? null : prev_node_id,
            next_node_id: isAllAmount ? null : next_node_id,
          }
        }),
      },
    };

    return await client?.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Repay Loan"
    );
  };

  const stake = async (senderAddress: string, amount: number) => {
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ stake: {} }),
      },
    };

    return client?.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Stake"
    );
  };

  const unstake = async (senderAddress: string, amount: number) => {
    return await client?.execute(
      senderAddress,
      contractAddress,
      { unstake: { amount: getRequestAmount(amount, baseCoin.ausdDecimal) } },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Unstake"
    );
  };

  const updateReward = async (senderAddress: string) => {
    const stakeMsg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ stake: {} }),
      }
    };

    const unstakeMsg = {
      unstake: {
        amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal)
      }
    }
    console.log("ausd", ausdContractAddress)
    console.log("contractAddress", contractAddress)
    console.log("senderAddress", senderAddress)
    return await client?.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: contractAddress,
          msg: unstakeMsg
        },
        {
          contractAddress: ausdContractAddress,
          msg: stakeMsg
        }
      ],
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000"
      },
      "Update Reward"
    );
  }

  const basePrice = coinPricesByDenom[baseCoin?.denom || ""] ?? 0;

  const processRedeemICR = async (amount: string) => {
    let remainingAmount = BigInt(amount)
    let icrdata = (await requestRedeemICR()).troves.nodes.map(i => {
      return {
        debt: BigInt(i.debtAmount),
        collateral: BigInt(i.collaterals[0].amount.slice(0, -1))
      }
    })
    let selectedidx = 0
    for (let idx in icrdata) {
      let trove = icrdata[idx]
      if (remainingAmount > trove.debt) {
        remainingAmount -= trove.debt
      } else {
        selectedidx = Number(idx)
        break
      }
    }
    let troveDebt = icrdata[selectedidx].debt - remainingAmount
    if (Number(troveDebt) === 0) return 0
    let collateraltodecrease = BigInt(Number(remainingAmount) / basePrice)
    let troveCollateral = icrdata[selectedidx].collateral - collateraltodecrease
    return Number(troveCollateral) / Number(troveDebt)
  }

  const redeem = async (senderAddress: string, amount: number) => {
    let prev_node = undefined
    let next_node = undefined
    let icr = await processRedeemICR(getRequestAmount(amount, baseCoin.ausdDecimal))
    if (icr != 0) {
      const { prev_node_id, next_node_id } = await FindSortedTroveInsertPosition(icr);
      prev_node = prev_node_id
      next_node = next_node_id
    }
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ redeem: { prev_node_id: prev_node, next_node_id: next_node } }),
      },
    };

    return await client?.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Redeem"
    );
  };

  const liquidateTroves = async (senderAddress: string) => {
    return await client?.execute(
      senderAddress,
      contractAddress,
      { liquidate_troves: {} },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "500000",
      },
      "Liquidate Troves"
    );
  };

  const liquidateTrovesV2 = async (senderAddress: string, owner: string) => {
    return await client?.execute(
      senderAddress,
      contractAddress,
      {
        liquidate_troves: {
          liquidation_list: [owner],
        }
      },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "5000000",
      },
      "Liquidate Troves"
    );
  };

  const withdrawLiquidationGains = async (senderAddress: string) => {
    return await client?.execute(
      senderAddress,
      contractAddress,
      { withdraw_liquidation_gains: {} },
      {
        amount: [{ amount: "0", denom: "uxion" }],
        gas: "800000",
      },
      "Withdraw Liquidation Gains"
    );
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
    FindSortedTroveInsertPosition,
    updateReward
  };
};
