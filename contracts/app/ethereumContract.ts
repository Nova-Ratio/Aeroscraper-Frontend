import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponse } from "./types";
import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { BaseCoin, ClientEnum } from "@/types/types";
import { BaseCoinByClient, getContractAddressesByClient } from "@/constants/walletConstants";
import { ChainGrpcWasmApi, fromBase64, toBase64, MsgExecuteContract, ChainRestAuthApi, BaseAccount, ChainRestTendermintApi, getAddressFromInjectiveAddress, recoverTypedSignaturePubKey, hexToBase64, TxGrpcClient, createTransaction, createWeb3Extension, createTxRawEIP712, DEFAULT_STD_FEE, SIGN_AMINO, TxRestClient, getEip712TypedData, hexToBuff, getEthereumAddress } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { MsgBroadcaster, WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId, CosmosChainId } from '@injectivelabs/ts-types';
import { isNil } from "lodash";
import { WalletType } from "@/enums/WalletType";
import { DEFAULT_BLOCK_TIMEOUT_HEIGHT, BigNumberInBase } from '@injectivelabs/utils'

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

export const getAppEthContract = (
    client: any,
    baseCoin: BaseCoin,
    clientType?: ClientEnum,
    walletType?: WalletType
) => {
    const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByClient(clientType);

    //GET QUERIES

    const getVAA = async (): Promise<any> => {
        if (isNil(clientType)) {
            throw new Error("Error getting client")
        }

        const priceIdByCLient: Record<ClientEnum, { priceId: string, serviceUrl: string }> = {
            [ClientEnum.SEI]: { priceId: "53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb", serviceUrl: "https://xc-mainnet.pyth.network/" },
            [ClientEnum.ARCHWAY]: { priceId: "53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb", serviceUrl: "https://xc-mainnet.pyth.network/" },
            [ClientEnum.NEUTRON]: { priceId: "8112fed370f3d9751e513f7696472eab61b7f4e2487fd9f46c93de00a338631c", serviceUrl: "https://hermes-beta.pyth.network/" },
            [ClientEnum.INJECTIVE]: { priceId: "2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3", serviceUrl: "https://hermes-beta.pyth.network/" },
        }


        const connection = new PriceServiceConnection(priceIdByCLient[clientType!].serviceUrl,
            {
                priceFeedRequestConfig: {
                    binary: true,
                },
            }
        )

        const res = await connection.getLatestPriceFeeds([priceIdByCLient[clientType!].priceId]);

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
        let anyWindow: any = window;

        try {
            if (clientType === ClientEnum.INJECTIVE && anyWindow.ethereum!) {

                const vaa = await getVAA();

                const msg = MsgExecuteContract.fromJSON({
                    contractAddress: oraclecontractAddress,
                    sender: senderAddress,
                    msg: {
                        update_price_feeds: {
                            data: [
                                vaa
                            ]
                        }
                    },
                    funds: [coin("1", BaseCoinByClient[clientType].denom)]
                })

                const msg1 = MsgExecuteContract.fromJSON({
                    contractAddress: contractAddress,
                    sender: senderAddress,
                    msg: {
                        open_trove: {
                            loan_amount: getRequestAmount(loanAmount, baseCoin.ausdDecimal)
                        }
                    },
                    funds: [coin(getRequestAmount(amount, baseCoin.decimal), BaseCoinByClient[clientType].denom)]
                })

                const chainRestAuthApi = new ChainRestAuthApi(
                    "https://injective-testnet-rest.publicnode.com",
                )
                const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
                    senderAddress,
                )
                const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
                const accountDetails = baseAccount.toAccountDetails()
                console.log(accountDetails);

                const chainRestTendermintApi = new ChainRestTendermintApi(
                    "https://injective-testnet-rest.publicnode.com",
                )
                const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
                const latestHeight = latestBlock.header.height
                const timeoutHeight = new BigNumberInBase(latestHeight).plus(
                    DEFAULT_BLOCK_TIMEOUT_HEIGHT,
                )

                const eip712TypedData = getEip712TypedData({
                    msgs: [msg, msg1],
                    tx: {
                        accountNumber: accountDetails.accountNumber.toString(),
                        sequence: accountDetails.sequence.toString(),
                        timeoutHeight: timeoutHeight.toFixed(),
                        chainId: "injective-888",
                    },
                    ethereumChainId: EthereumChainId.Goerli,
                });

                const signature = await anyWindow.ethereum.request({
                    method: 'eth_signTypedData_v4',
                    params: [getEthereumAddress(senderAddress), JSON.stringify(eip712TypedData)],
                });

                const publicKeyHex = recoverTypedSignaturePubKey(eip712TypedData, signature);
                const publicKeyBase64 = hexToBase64(publicKeyHex);

                const { txRaw } = createTransaction({
                    message: [msg, msg1],
                    memo: '',
                    signMode: SIGN_AMINO,
                    fee: DEFAULT_STD_FEE,
                    pubKey: publicKeyBase64,
                    sequence: baseAccount.sequence,
                    timeoutHeight: timeoutHeight.toNumber(),
                    accountNumber: baseAccount.accountNumber,
                    chainId: "injective-888",
                })

                const web3Extension = createWeb3Extension({
                    ethereumChainId: EthereumChainId.Goerli,
                })
                const txRawEip712 = createTxRawEIP712(txRaw, web3Extension);

                const signatureBuff = hexToBuff(signature);
                txRawEip712.signatures = [signatureBuff];

                const txRestClient = new TxRestClient("https://injective-testnet-rest.publicnode.com");

                const response = txRestClient.broadcast(txRawEip712);

                return await response
            }
        } catch (error) {
            console.log(error);

        }
    }

    const addCollateral = async (senderAddress: string, amount: number) => {
        if (clientType === ClientEnum.ARCHWAY) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { add_collateral: {} },
                "auto",
                "Add Collateral",
                [coin(getRequestAmount(amount, baseCoin.decimal), BaseCoinByClient[clientType].denom)]
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { add_collateral: {} },
                "auto",
                "Add Collateral",
                [coin(getRequestAmount(amount, baseCoin.decimal), BaseCoinByClient[clientType].denom)]
            )
        }

        const vaa = await getVAA();

        if (clientType === ClientEnum.INJECTIVE) {
            const msg = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: contractAddress,
                sender: senderAddress,
                msg: { add_collateral: {} },
                funds: [coin(getRequestAmount(amount, baseCoin.decimal), BaseCoinByClient[clientType].denom)]
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msg, msg1],
                injectiveAddress: senderAddress
            })
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
                    contractAddress,
                    msg: { add_collateral: {} },
                    funds: [coin(getRequestAmount(amount, baseCoin.decimal), "usei")]
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
                { remove_collateral: { collateral_amount: getRequestAmount(amount, baseCoin.decimal) } },
                "auto",
                "Remove Collateral"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { remove_collateral: { collateral_amount: getRequestAmount(amount, baseCoin.decimal) } },
                "auto",
                "Remove Collateral"
            )
        }

        const vaa = await getVAA();

        if (clientType === ClientEnum.INJECTIVE) {
            const msg = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: contractAddress,
                sender: senderAddress,
                msg: { remove_collateral: { collateral_amount: getRequestAmount(amount, baseCoin.decimal) } }
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msg, msg1],
                injectiveAddress: senderAddress
            })
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
                    contractAddress,
                    msg: { remove_collateral: { collateral_amount: getRequestAmount(amount, baseCoin.decimal) } }
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
                { borrow_loan: { loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal) } },
                "auto",
                "Borrow Loan"
            )
        }

        if (clientType === ClientEnum.NEUTRON) {
            return await client.execute(
                senderAddress,
                contractAddress,
                { borrow_loan: { loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal) } },
                "auto",
                "Borrow Loan"
            )
        }

        const vaa = await getVAA();

        if (clientType === ClientEnum.INJECTIVE) {
            const msg = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: contractAddress,
                sender: senderAddress,
                msg: { borrow_loan: { loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal) } }
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msg, msg1],
                injectiveAddress: senderAddress
            })
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

        if (clientType === ClientEnum.INJECTIVE) {
            const msgVAA = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: ausdContractAddress,
                sender: senderAddress,
                msg
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msgVAA, msg1],
                injectiveAddress: senderAddress
            })
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
                amount: getRequestAmount(amount, baseCoin.ausdDecimal),
                msg: jsonToBinary({ stake: {} })
            }
        }

        if (clientType === ClientEnum.INJECTIVE) {
            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: ausdContractAddress,
                sender: senderAddress,
                msg
            })

            return await msgBroadcastClient.broadcast({
                msgs: msg1,
                injectiveAddress: senderAddress
            })
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
        if (clientType === ClientEnum.INJECTIVE) {
            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: contractAddress,
                sender: senderAddress,
                msg: { unstake: { amount: getRequestAmount(amount, baseCoin.ausdDecimal) } }
            })

            return await msgBroadcastClient.broadcast({
                msgs: msg1,
                injectiveAddress: senderAddress
            })
        }

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

        if (clientType === ClientEnum.INJECTIVE) {
            const msg0 = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress: ausdContractAddress,
                sender: senderAddress,
                msg
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msg0, msg1],
                injectiveAddress: senderAddress
            })
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

        if (clientType === ClientEnum.INJECTIVE) {
            const msg0 = MsgExecuteContract.fromJSON({
                contractAddress: oraclecontractAddress,
                sender: senderAddress,
                msg: {
                    update_price_feeds: {
                        data: [
                            vaa
                        ]
                    }
                },
                funds: [coin("1", BaseCoinByClient[clientType].denom)]
            })

            const msg1 = MsgExecuteContract.fromJSON({
                contractAddress,
                sender: senderAddress,
                msg: { liquidate_troves: {} }
            })

            return await msgBroadcastClient.broadcast({
                msgs: [msg0, msg1],
                injectiveAddress: senderAddress
            })
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
                    contractAddress,
                    msg: { liquidate_troves: {} }
                }
            ],
            "auto",
            "Liquidate Troves",
        )
    }

    const withdrawLiquidationGains = async (senderAddress: string) => {
        if (clientType === ClientEnum.INJECTIVE) {
            const msg = MsgExecuteContract.fromJSON({
                contractAddress,
                sender: senderAddress,
                msg: { withdraw_liquidation_gains: {} }
            })

            return await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: senderAddress
            })
        }

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
function getEip712Tx(arg0: { msgs: MsgExecuteContract[]; tx: { accountNumber: string; sequence: string; timeoutHeight: any; chainId: any; }; ethereumChainId: any; }) {
    throw new Error("Function not implemented.");
}

