import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponse } from "./types";
import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { BaseCoin, ClientEnum } from "@/types/types";
import { BaseCoinByClient, getContractAddressesByClient } from "@/constants/walletConstants";
import { MsgExecuteContract, ChainRestAuthApi, BaseAccount, ChainRestTendermintApi, getAddressFromInjectiveAddress, recoverTypedSignaturePubKey, hexToBase64, TxGrpcClient, createTransaction, createWeb3Extension, createTxRawEIP712, DEFAULT_STD_FEE, SIGN_AMINO, TxRestClient, getEip712TypedData, hexToBuff, getEthereumAddress } from "@injectivelabs/sdk-ts";

import { EthereumChainId } from '@injectivelabs/ts-types';
import { isNil } from "lodash";

import { DEFAULT_BLOCK_TIMEOUT_HEIGHT, BigNumberInBase, getStdFee } from '@injectivelabs/utils'
import { getConfig } from "@/config";

export const getAppEthContract = (
    client: any,
    baseCoin: BaseCoin,
    clientType?: ClientEnum,
) => {
    const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByClient(clientType);

    const createEthSignature = async (senderAddress: string, msg: MsgExecuteContract | MsgExecuteContract[]) => {
        let anyWindow: any = window;

        const chainConfig = getConfig("", clientType);

        if (!anyWindow.ethereum) return;

        const chainRestAuthApi = new ChainRestAuthApi(chainConfig.httpUrl!);
        const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
        const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
        const accountDetails = baseAccount.toAccountDetails();
        const chainRestTendermintApi = new ChainRestTendermintApi(chainConfig.httpUrl!);
        const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
        const latestHeight = latestBlock.header.height;
        const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);

        const eip712TypedData = getEip712TypedData({
            msgs: msg,
            fee: getStdFee({ gasPrice: chainConfig.gasPrice }),
            tx: {
                memo: '',
                accountNumber: accountDetails.accountNumber.toString(),
                sequence: accountDetails.sequence.toString(),
                timeoutHeight: timeoutHeight.toFixed(),
                chainId: chainConfig.chainId,
            },
            ethereumChainId: EthereumChainId.Goerli,
        });

        const signature = await anyWindow.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [getEthereumAddress(senderAddress), JSON.stringify(eip712TypedData)],
        });
        const signatureBuff = hexToBuff(signature)

        const publicKeyHex = recoverTypedSignaturePubKey(eip712TypedData, signature);
        const publicKeyBase64 = hexToBase64(publicKeyHex);

        const { txRaw } = createTransaction({
            message: msg,
            memo: '',
            signMode: SIGN_AMINO,
            fee: DEFAULT_STD_FEE,
            pubKey: publicKeyBase64,
            sequence: baseAccount.sequence,
            timeoutHeight: timeoutHeight.toNumber(),
            accountNumber: baseAccount.accountNumber,
            chainId: chainConfig.chainId,
        })

        const web3Extension = createWeb3Extension({ ethereumChainId: EthereumChainId.Goerli });

        const txRawEip712 = createTxRawEIP712(txRaw, web3Extension);

        txRawEip712.signatures = [signatureBuff];

        const txRestClient = new TxRestClient(chainConfig.httpUrl!);

        const { txHash } = await txRestClient.broadcast(txRawEip712);

        return await txRestClient.fetchTxPoll(txHash);
    }

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

        }

        return await client.queryContractSmart(contractAddress, { total_collateral_amount: {} });
    }

    const getTotalDebtAmount = async (): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
    }

    const getTrove = async (user_addr: string): Promise<GetTroveResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { trove: { user_addr } });
    }

    const getStake = async (user_addr: string): Promise<GetStakeResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { stake: { user_addr } });
    }

    const getTotalStake = async (): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { total_stake_amount: {} });
    }

    const getCollateralPrice = async () => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { collateral_price: {} });
    }

    const getAusdBalance = async (address: string): Promise<CW20BalanceResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(ausdContractAddress, { balance: { address } })
    }

    const getAusdInfo = async (): Promise<CW20TokenInfoResponse> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(ausdContractAddress, { token_info: {} })
    }

    const getReward = async (user_addr: string): Promise<string> => {
        if (clientType === ClientEnum.INJECTIVE) {

        }

        return await client.queryContractSmart(contractAddress, { liquidation_gains: { user_addr } })
    }

    //EXECUTE QUERIES
    const openTrove = async (senderAddress: string, amount: number, loanAmount: number) => {

        try {
            if (clientType === ClientEnum.INJECTIVE) {

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

                const broadcast = createEthSignature(senderAddress, [msg, msg1]);
                console.log(await broadcast);

                return await broadcast;
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

