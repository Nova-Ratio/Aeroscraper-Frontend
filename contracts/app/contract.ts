import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponse } from "./types";
import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { ClientEnum, isClientInjective } from "@/types/types";
import { BaseCoinByClient, getContractAddressesByClient } from "@/constants/walletConstants";
import { ChainGrpcWasmApi, MsgExecuteContractCompat, fromBase64, toBase64 } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { MsgBroadcaster, WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId } from '@injectivelabs/ts-types';

const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet
});

const NETWORK = Network.Testnet;
const ENDPOINTS = getNetworkEndpoints(NETWORK);

const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
const msgBroadcastClient = new MsgBroadcaster({
    walletStrategy,
    network: NETWORK,
});

export const getAppContract = (
    client: SigningArchwayClient | SigningCosmWasmClient,
    clientType?: ClientEnum
) => {
    const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByClient(clientType);

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
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ total_collateral_amount: {} }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { total_collateral_amount: {} });
    }

    const getTotalDebtAmount = async (): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ total_debt_amount: {} }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
    }

    const getTrove = async (user_addr: string): Promise<GetTroveResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ trove: { user_addr } }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { trove: { user_addr } });
    }

    const getStake = async (user_addr: string): Promise<GetStakeResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ stake: { user_addr } }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { stake: { user_addr } });
    }

    const getTotalStake = async (): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ total_stake_amount: {} }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { total_stake_amount: {} });
    }

    const getCollateralPrice = async () => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ collateral_price: {} }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { collateral_price: {} });
    }

    const getAusdBalance = async (address: string): Promise<CW20BalanceResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(ausdContractAddress, toBase64({ balance: { address } }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(ausdContractAddress, { balance: { address } })
    }

    const getAusdInfo = async (): Promise<CW20TokenInfoResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(ausdContractAddress, toBase64({ token_info: {} }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(ausdContractAddress, { token_info: {} })
    }

    const getReward = async (user_addr: string): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {
            const res = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, toBase64({ liquidation_gains: { user_addr } }))
            const data: any = fromBase64(res.data as any);
            return data;
        }

        return await client.queryContractSmart(contractAddress, { liquidation_gains: { user_addr } })
    }

    //EXECUTE QUERIES
    const openTrove = async (senderAddress: string, amount: number, loanAmount: number) => {
        if (clientType === ClientEnum.INJECTIVE) {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: contractAddress,
                sender: senderAddress,
                msg: {
                    open_trove: {
                        loan_amount: getRequestAmount(loanAmount)
                    }
                },
            })

            return await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: senderAddress
            })
        }

        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { open_trove: { loan_amount: getRequestAmount(loanAmount) } },
                "auto",
                "Open Trove",
                [coin(getRequestAmount(amount), BaseCoinByClient[clientType].denom)]
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { open_trove: { loan_amount: getRequestAmount(loanAmount) } },
                "auto",
                "Open Trove",
                [coin(getRequestAmount(amount), BaseCoinByClient[clientType].denom)]
            )
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
                    contractAddress,
                    msg: { open_trove: { loan_amount: getRequestAmount(loanAmount) } },
                    funds: [coin(getRequestAmount(amount), "usei")]
                }
            ],
            "auto",
            "Open Trove",
        )
    }

    const addCollateral = async (senderAddress: string, amount: number) => {
        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { add_collateral: {} },
                "auto",
                "Add Collateral",
                [coin(getRequestAmount(amount), BaseCoinByClient[clientType].denom)]
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { add_collateral: {} },
                "auto",
                "Add Collateral",
                [coin(getRequestAmount(amount), BaseCoinByClient[clientType].denom)]
            )
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
        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { remove_collateral: { collateral_amount: getRequestAmount(amount) } },
                "auto",
                "Remove Collateral"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { remove_collateral: { collateral_amount: getRequestAmount(amount) } },
                "auto",
                "Remove Collateral"
            )
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
                    contractAddress,
                    msg: { remove_collateral: { collateral_amount: getRequestAmount(amount) } }
                }
            ],
            "auto",
            "Remove Collateral",
        )
    }

    const borrowLoan = async (senderAddress: string, amount: number) => {
        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { borrow_loan: { loan_amount: getRequestAmount(amount) } },
                "auto",
                "Borrow Loan"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { borrow_loan: { loan_amount: getRequestAmount(amount) } },
                "auto",
                "Borrow Loan"
            )
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
                    contractAddress,
                    msg: { borrow_loan: { loan_amount: getRequestAmount(amount) } }
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
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ repay_loan: {} })
            }
        }

        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                ausdContractAddress,
                msg,
                "auto",
                "Repay Loan"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                ausdContractAddress,
                msg,
                "auto",
                "Repay Loan"
            )
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
        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ redeem: {} })
            }
        }

        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                ausdContractAddress,
                msg,
                "auto",
                "Redeem"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                ausdContractAddress,
                msg,
                "auto",
                "Redeem"
            )
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
        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { liquidate_troves: {} },
                "auto",
                "Liquidate Troves"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { liquidate_troves: {} },
                "auto",
                "Liquidate Troves"
            )
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
