import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponseV1, GetTroveResponseV2 } from "./types";
import { BaseCoin, CollateralAsset } from "@/types/types";
import { priceIdByChainName } from "@/constants/chainConstants";
import { isNil } from "lodash";
import { WalletType } from "@/enums/WalletType";
import { TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { ChainName } from "@/enums/Chain";
import { getContractAddressesByChain } from "@/constants/chainConstants";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import graphql from "@/services/graphql";
import { HermesClient } from "@pythnetwork/hermes-client";

export const getAppContract = (
  client: SigningCosmWasmClient,
  baseCoin: BaseCoin,
  chainName: ChainName,
  walletType?: WalletType,
  basePrice: number = 0
) => {
  const defaultAsset = DefaultAssetByChainName[chainName];
  const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByChain(chainName);
  const { requestICR, requestRedeemICR } = graphql({ selectedChainName: ChainName.SEI });

  //GET QUERIES

  const getVAA = async (asset?: CollateralAsset): Promise<any> => {
    if (isNil(chainName)) {
      throw new Error("Error getting client")
    }

    const priceId = isNil(asset) ? priceIdByChainName[chainName].priceId : asset.priceId;
    const serviceUrl = isNil(asset) ? priceIdByChainName[chainName].serviceUrl : asset.priceServiceUrl;

    const connection = new HermesClient(serviceUrl, {});

    const res = await connection.getLatestPriceUpdates([priceId], { encoding: "base64" });

    if (res) {
      return res.binary.data[0]
    } else {
      throw new Error("Error getting price feed");
    }

  }

  const findSortedTroveInsertPosition = async (
    collRatio: number,
    user_addr?: string
  ): Promise<{ prev_node_id: string | undefined, next_node_id: string | undefined }> => {
    let next_node_id
    let prev_node_id

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

  const getTotalCollateralAmounts = async (): Promise<TotalCollateralModel | undefined> => {
    return await client.queryContractSmart(contractAddress, { total_collateral_amounts: {} });
  }

  const getTotalDebtAmount = async (): Promise<string> => {
    return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
  }

  const getTrove = async (user_addr: string): Promise<GetTroveResponseV1 | GetTroveResponseV2> => {
    return await client.queryContractSmart(contractAddress, { trove: { user_addr } });
  }

  const getStake = async (user_addr: string): Promise<GetStakeResponse> => {
    return await client.queryContractSmart(contractAddress, { stake: { user_addr } });
  }

  const getTotalStake = async (): Promise<string> => {
    return await client.queryContractSmart(contractAddress, { total_stake_amount: {} });
  }

  const getCollateralPrice = async () => {
    return await client.queryContractSmart(contractAddress, { collateral_price: {} });
  }

  const getAusdBalance = async (address: string): Promise<CW20BalanceResponse> => {
    return await client.queryContractSmart(ausdContractAddress, { balance: { address } })
  }

  const getAusdInfo = async (): Promise<CW20TokenInfoResponse> => {
    return await client.queryContractSmart(ausdContractAddress, { token_info: {} })
  }

  const getReward = async (user_addr: string): Promise<string> => {
    return await client.queryContractSmart(contractAddress, { liquidation_gains: { user_addr } })
  }

  //EXECUTE QUERIES
  const openTrove = async (
    senderAddress: string,
    amount: number,
    loanAmount: number,
    collRatio: number,
    asset: CollateralAsset = defaultAsset
  ) => {
    const vaa = await getVAA();
    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(collRatio, senderAddress);
    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: {
            open_trove: {
              loan_amount: getRequestAmount(loanAmount, asset.ausdDecimal),
              prev_node_id,
              next_node_id
            }
          },
          funds: [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
        }
      ],
      "auto",
      "Open Trove",
    )
  }

  const addCollateral = async (senderAddress: string, amount: number, collRatio: number, asset: CollateralAsset = defaultAsset) => {
    const vaa = await getVAA(asset);
    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(collRatio, senderAddress);

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: { add_collateral: { prev_node_id, next_node_id } },
          funds: [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
        }
      ],
      "auto",
      "Add Collateral",
    )
  }

  const removeCollateral = async (senderAddress: string, amount: number, collRatio: number, asset: CollateralAsset = defaultAsset) => {
    const vaa = await getVAA();
    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(collRatio, senderAddress);

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: {
            remove_collateral: {
              collateral_amount: getRequestAmount(amount, asset.decimal),
              prev_node_id,
              next_node_id
            }
          }
        }
      ],
      "auto",
      "Remove Collateral",
    )
  }

  const borrowLoan = async (senderAddress: string, amount: number, collRatio: number) => {
    const vaa = await getVAA();
    const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(collRatio, senderAddress);

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: {
            borrow_loan: {
              loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal),
              prev_node_id,
              next_node_id
            }
          }
        }
      ],
      "auto",
      "Borrow Loan",
    )
  }

  const repayLoan = async (senderAddress: string, amount: number, collRatio: number, isAllAmount: boolean) => {
    let prev_node_id = null;
    let next_node_id = null;

    if (!isAllAmount) {
      const response = await findSortedTroveInsertPosition(collRatio, senderAddress);
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
            next_node_id
          }
        })
      }
    }

    const vaa = await getVAA();

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          msg,
          contractAddress: ausdContractAddress,
        }
      ],
      "auto",
      "Repay Loan",
    )
  }

  const stake = async (senderAddress: string, amount: number) => {
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ stake: {} })
      }
    }

    return client.execute(
      senderAddress,
      ausdContractAddress,
      msg,
      "auto",
      "Stake"
    )
  }

  const unstake = async (senderAddress: string, amount: number) => {
    return await client.execute(
      senderAddress,
      contractAddress,
      { unstake: { amount: getRequestAmount(amount, baseCoin.ausdDecimal) } },
      "auto",
      "Unstake"
    )
  }

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
      const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(icr);
      prev_node = prev_node_id
      next_node = next_node_id
    }

    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.decimal),
        msg: jsonToBinary({
          redeem: {
            prev_node_id: prev_node,
            next_node_id: next_node
          }
        })
      }
    }

    const vaa = await getVAA();

    return client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          msg,
          contractAddress: ausdContractAddress
        }
      ],
      "auto",
      "Redeem"
    )
  }

  const liquidateTroves = async (senderAddress: string) => {
    const vaa = await getVAA();

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: { liquidate_troves: {} }
        }
      ],
      "auto",
      "Liquidate Troves",
    )
  }

  const liquidateTrovesV2 = async (senderAddress: string, owner: string) => {
    const vaa = await getVAA();

    return await client.executeMultiple(
      senderAddress,
      [
        {
          contractAddress: oraclecontractAddress,
          msg: {
            update_price_feeds: {
              data: [
                vaa
              ]
            }
          },
          funds: [{ amount: "1", denom: "usei" }],
        },
        {
          contractAddress,
          msg: { liquidate_troves: {} }
        }
      ],
      "auto",
      "Liquidate Troves",
    )
  }

  const withdrawLiquidationGains = async (senderAddress: string) => {
    return await client.execute(
      senderAddress,
      contractAddress,
      { withdraw_liquidation_gains: {} },
      "auto",
      "Withdraw Liquidation Gains"
    )
  }

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
    liquidateTroves,
    liquidateTrovesV2,
    withdrawLiquidationGains
  }
}