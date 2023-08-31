import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponse } from "./types";
import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { SigningArchwayClient } from "@archwayhq/arch3.js/build";

export const getAppContract = (client: SigningCosmWasmClient | SigningArchwayClient) => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const oraclecontractAddress = process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string;
    const ausdContractAddress = process.env.NEXT_PUBLIC_AUSD_CONTRACT_ADDRESS as string;

    //GET QUERIES

    const getVAA = async (): Promise<any> => {
        const connection = new PriceServiceConnection("https://xc-mainnet.pyth.network/",
            {
                priceFeedRequestConfig: {
                    binary: true,
                },
            }
        )

        const priceIds = ["53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb"];

        const res = await connection.getLatestPriceFeeds(priceIds);

        if (res) {
            return res[0].getVAA()
        } else {
            throw new Error("Error getting price feed")
        }
    }

    const getTotalCollateralAmount = async (): Promise<string> => {
        return await client.queryContractSmart(contractAddress, { total_collateral_amount: {} });
    }

    const getTotalDebtAmount = async (): Promise<string> => {
        return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
    }

    const getTrove = async (user_addr: string): Promise<GetTroveResponse> => {
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
    const openTrove = async (senderAddress: string, amount: number, loanAmount: number) => {
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
                    msg: { open_trove: { loan_amount: getRequestAmount(loanAmount) } },
                    funds: [coin(getRequestAmount(amount), "usei")]
                }
            ],
            "auto",
            "Open Trove",
        ).catch(err => console.log(err))
    }

    const addCollateral = async (senderAddress: string, amount: number) => {
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
                    msg: { add_collateral: {} },
                    funds: [coin(getRequestAmount(amount), "usei")]
                }
            ],
            "auto",
            "Add Collateral",
        )
    }

    const removeCollateral = async (senderAddress: string, amount: number) => {
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
                    msg: { remove_collateral: { collateral_amount: getRequestAmount(amount) } }
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
                    msg: { borrow_loan: { loan_amount: getRequestAmount(amount) } }
                }
            ],
            "auto",
            "Borrow Loan",
        )
    }

    const repayLoan = async (senderAddress: string, amount: number) => {

        const vaa = await getVAA();

        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ repay_loan: {} })
            }
        }

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
                amount: getRequestAmount(amount),
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
            { unstake: { amount: getRequestAmount(amount) } },
            "auto",
            "Unstake"
        )
    }

    const redeem = async (senderAddress: string, amount: number) => {
        const vaa = await getVAA();

        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ redeem: {} })
            }
        }

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
        ).catch(err => console.log(err))
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
        getTotalCollateralAmount,
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
        withdrawLiquidationGains
    }
}
