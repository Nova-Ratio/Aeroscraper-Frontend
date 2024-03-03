import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponseV1, GetTroveResponseV2 } from "./types";
import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { BaseCoin, CollateralAsset } from "@/types/types";
import { BaseCoinByChainName, priceIdByChainName } from "@/constants/chainConstants";
import { isNil } from "lodash";
import { WalletType } from "@/enums/WalletType";
import { TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { ChainName } from "@/enums/Chain";
import { getContractAddressesByChain } from "@/constants/chainConstants";
import { DefaultAssetByChainName } from "@/constants/assetConstants";

export const getAppContract = (
  client: SigningCosmWasmClient,
  baseCoin: BaseCoin,
  chainName: ChainName,
  walletType?: WalletType
) => {
  const defaultAsset = DefaultAssetByChainName[chainName];
  const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByChain(chainName);

  //GET QUERIES

  const getVAA = async (asset?: CollateralAsset): Promise<any> => {
    if (isNil(chainName)) {
      throw new Error("Error getting client")
    }

    const priceId = isNil(asset) ? priceIdByChainName[chainName].priceId : asset.priceId;
    const serviceUrl = isNil(asset) ? priceIdByChainName[chainName].serviceUrl : asset.priceServiceUrl;

    const connection = new PriceServiceConnection(serviceUrl,
      {
        priceFeedRequestConfig: {
          binary: true,
        },
      }
    )

    const res = await connection.getLatestPriceFeeds([priceId]);

    if (res) {
      return res[0].getVAA()
    } else {
      throw new Error("Error getting price feed")
    }
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
  const openTrove = async (senderAddress: string, amount: number, loanAmount: number, asset: CollateralAsset = defaultAsset) => {
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
          msg: { open_trove: { loan_amount: getRequestAmount(loanAmount, asset.ausdDecimal) } },
          funds: [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
        }
      ],
      "auto",
      "Open Trove",
    )
  }

  const addCollateral = async (senderAddress: string, amount: number, asset: CollateralAsset = defaultAsset) => {
    const vaa = await getVAA(asset);

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
          msg: { add_collateral: {} },
          funds: [coin(getRequestAmount(amount, asset.decimal), asset.denom)]
        }
      ],
      "auto",
      "Add Collateral",
    )
  }

  const removeCollateral = async (senderAddress: string, amount: number, asset: CollateralAsset = defaultAsset) => {
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
          msg: { remove_collateral: { collateral_amount: getRequestAmount(amount, asset.decimal) } }
        }
      ],
      "auto",
      "Remove Collateral",
    )
  }

  const borrowLoan = async (senderAddress: string, amount: number) => {
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
          msg: { borrow_loan: { loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal) } }
        }
      ],
      "auto",
      "Borrow Loan",
    )
  }

  const repayLoan = async (senderAddress: string, amount: number) => {
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.ausdDecimal),
        msg: jsonToBinary({ repay_loan: {} })
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

  const redeem = async (senderAddress: string, amount: number) => {
    const msg = {
      send: {
        contract: contractAddress,
        amount: getRequestAmount(amount, baseCoin.decimal),
        msg: jsonToBinary({ redeem: {} })
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