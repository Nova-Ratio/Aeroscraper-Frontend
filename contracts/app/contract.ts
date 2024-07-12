import { getRequestAmount } from "@/utils/contractUtils";
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
import { WalletType } from "@/enums/WalletType";
import { Chain, TotalCollateralModel } from "@/app/app/dashboard/_types/types";
import { ChainName } from "@/enums/Chain";
import {
    BaseCoinByChainName,
    getContractAddressesByChain,
    priceIdByChainName,
} from "@/constants/chainConstants";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import graphql from "@/services/graphql";
import { HermesClient } from "@pythnetwork/hermes-client";
import { ContractExecuteTransaction, ContractFunctionParameters, Transaction } from "@hashgraph/sdk";
import { UserInfo } from "@/contexts/AppProvider";
import { ethers } from "ethers";

const updateRewardAmount = 0.01;

export const getAppContract = (
    userInfo: UserInfo,
    baseCoin: BaseCoin,
    chainName: ChainName,
    walletType?: WalletType,
    basePrice: number = 0
) => {
    const defaultAsset = DefaultAssetByChainName[chainName];

    const { contractAddress, oraclecontractAddress, ausdContractAddress } = getContractAddressesByChain(chainName);

    const { requestICR, requestRedeemICR } = graphql({ selectedChainName: ChainName.HEDERA });

    //GET QUERIES
    const getVAA = async (asset?: CollateralAsset): Promise<any> => {
        if (isNil(chainName)) {
            throw new Error("Error getting client");
        }

        const priceId = isNil(asset)
            ? priceIdByChainName[chainName].priceId
            : asset.priceId;
        const serviceUrl = isNil(asset)
            ? priceIdByChainName[chainName].serviceUrl
            : asset.priceServiceUrl;

        const connection = new HermesClient(serviceUrl, {});

        const res = await connection.getLatestPriceUpdates([priceId], { encoding: "hex" });

        if (res) {
            return res.binary.data[0]
        } else {
            throw new Error("Error getting price feed");
        }
    };

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

    //   const getTotalCollateralAmounts = async (): Promise<
    //     TotalCollateralModel[] | undefined
    //   > => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ total_collateral_amount: {} })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getTotalDebtAmount = async (): Promise<string | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ total_debt_amount: {} })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getTrove = async (
    //     user_addr: string
    //   ): Promise<GetTroveResponseV1 | GetTroveResponseV2 | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ trove: { user_addr } })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getStake = async (
    //     user_addr: string
    //   ): Promise<GetStakeResponse | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ stake: { user_addr } })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getTotalStake = async (): Promise<string | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ total_stake_amount: {} })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getCollateralPrice = async () => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ collateral_price: {} })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getAusdBalance = async (
    //     address: string
    //   ): Promise<CW20BalanceResponse | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       ausdContractAddress,
    //       toBase64({ balance: { address } })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getAusdInfo = async (): Promise<CW20TokenInfoResponse | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       ausdContractAddress,
    //       toBase64({ token_info: {} })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //   const getReward = async (user_addr: string): Promise<string | undefined> => {
    //     const res = await chainGrpcWasmApi.fetchSmartContractState(
    //       contractAddress,
    //       toBase64({ liquidation_gains: { user_addr } })
    //     );
    //     const data: any = fromBase64(res.data as any);
    //     return data;
    //   };

    //EXECUTE QUERIES
    const openTrove = async (
        senderAddress: string,
        amount: number,
        loanAmount: number,
        collRatio: number,
        asset: CollateralAsset = defaultAsset
    ) => {

        const contractAddress = process.env.NEXT_PUBLIC_TROVE_MANAGER_CONTRACT_ID as string;
        const priceContractAddress = process.env.NEXT_PUBLIC_PRICE_FEED_CONTRACT_ID as string;

        const vaa = await getVAA(asset);
        const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(collRatio, senderAddress);

        const updatePriceFeedsParams = new ContractFunctionParameters()
            .addString(vaa)

        const openTroveParams = new ContractFunctionParameters()
            .addUint256(getRequestAmount(loanAmount, asset.ausdDecimal))
            .addString(prev_node_id as string)
            .addString(next_node_id as string);


        const updatePriceFeedsTx = new ContractExecuteTransaction()
            .setContractId(priceContractAddress)
            .setFunction("update_price_feeds", updatePriceFeedsParams)
            .setGas(100000)
            .freezeWithSigner(userInfo.signer);


        const openTroveTx: Transaction = await new ContractExecuteTransaction()
            .setContractId(contractAddress)
            .setFunction("open_trove", openTroveParams)
            .setGas(100000)
            .freezeWithSigner(userInfo.signer);

        userInfo.executeTransaction?.(updatePriceFeedsTx)
        await userInfo.executeTransaction?.(openTroveTx)

        return  
    };

    //   const addCollateral = async (
    //     senderAddress: string,
    //     amount: number,
    //     collRatio: number,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     const vaa = await getVAA(asset);
    //     const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
    //       collRatio,
    //       senderAddress
    //     );

    //     const msg = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: asset.oracleContractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: contractAddress,
    //       sender: senderAddress,
    //       msg: { add_collateral: { prev_node_id, next_node_id } },
    //       funds: [coin(getRequestAmount(amount, asset.decimal), asset.denom)],
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const removeCollateral = async (
    //     senderAddress: string,
    //     amount: number,
    //     collRatio: number,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     const vaa = await getVAA(asset);
    //     const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
    //       collRatio,
    //       senderAddress
    //     );

    //     const msg = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: asset.oracleContractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: contractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         remove_collateral: {
    //           collateral_denom: asset.denom,
    //           collateral_amount: getRequestAmount(amount, asset.decimal),
    //           prev_node_id,
    //           next_node_id,
    //         },
    //       },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const borrowLoan = async (
    //     senderAddress: string,
    //     amount: number,
    //     collRatio: number,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     const vaa = await getVAA(asset);
    //     const { prev_node_id, next_node_id } = await findSortedTroveInsertPosition(
    //       collRatio,
    //       senderAddress
    //     );

    //     const msg = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: asset.oracleContractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: contractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         borrow_loan: {
    //           loan_amount: getRequestAmount(amount, baseCoin.ausdDecimal),
    //           prev_node_id,
    //           next_node_id,
    //         },
    //       },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const repayLoan = async (
    //     senderAddress: string,
    //     amount: number,
    //     collRatio: number,
    //     isAllAmount: boolean,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     let prev_node_id = null;
    //     let next_node_id = null;

    //     if (!isAllAmount) {
    //       const response = await findSortedTroveInsertPosition(
    //         collRatio,
    //         senderAddress
    //       );
    //       prev_node_id = response.prev_node_id;
    //       next_node_id = response.next_node_id;
    //     }

    //     const msg = {
    //       send: {
    //         contract: contractAddress,
    //         amount: getRequestAmount(amount, baseCoin.ausdDecimal),
    //         msg: jsonToBinary({
    //           repay_loan: {
    //             prev_node_id,
    //             next_node_id,
    //           },
    //         }),
    //       },
    //     };

    //     const vaa = await getVAA(asset);

    //     const msgVAA = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: asset.oracleContractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: ausdContractAddress,
    //       sender: senderAddress,
    //       msg,
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msgVAA, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const stake = async (senderAddress: string, amount: number) => {
    //     const msg = {
    //       send: {
    //         contract: contractAddress,
    //         amount: getRequestAmount(amount, baseCoin.ausdDecimal),
    //         msg: jsonToBinary({ stake: {} }),
    //       },
    //     };

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: ausdContractAddress,
    //       sender: senderAddress,
    //       msg,
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: msg1,
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const unstake = async (senderAddress: string, amount: number) => {
    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: contractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         unstake: { amount: getRequestAmount(amount, baseCoin.ausdDecimal) },
    //       },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: msg1,
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const processRedeemICR = async (amount: string) => {
    //     let remainingAmount = BigInt(amount);
    //     let icrdata = (await requestRedeemICR()).troves.nodes.map((i) => {
    //       return {
    //         debt: BigInt(i.debtAmount),
    //         collateral: BigInt(i.collaterals[0].amount.slice(0, -1)),
    //       };
    //     });
    //     let selectedidx = 0;
    //     for (let idx in icrdata) {
    //       let trove = icrdata[idx];
    //       if (remainingAmount > trove.debt) {
    //         remainingAmount -= trove.debt;
    //       } else {
    //         selectedidx = Number(idx);
    //         break;
    //       }
    //     }
    //     let troveDebt = icrdata[selectedidx].debt - remainingAmount;
    //     if (Number(troveDebt) === 0) return 0;
    //     let collateraltodecrease = BigInt(Number(remainingAmount) / basePrice);
    //     let troveCollateral =
    //       icrdata[selectedidx].collateral - collateraltodecrease;
    //     return Number(troveCollateral) / Number(troveDebt);
    //   };

    //   const redeem = async (
    //     senderAddress: string,
    //     amount: number,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     let prev_node = undefined;
    //     let next_node = undefined;
    //     let icr = await processRedeemICR(
    //       getRequestAmount(amount, baseCoin.ausdDecimal)
    //     );
    //     if (icr != 0) {
    //       const { prev_node_id, next_node_id } =
    //         await findSortedTroveInsertPosition(icr, senderAddress);
    //       prev_node = prev_node_id;
    //       next_node = next_node_id;
    //     }

    //     const msg = {
    //       send: {
    //         contract: contractAddress,
    //         amount: getRequestAmount(amount, baseCoin.decimal),
    //         msg: jsonToBinary({
    //           redeem: {
    //             prev_node_id: prev_node,
    //             next_node_id: next_node,
    //           },
    //         }),
    //       },
    //     };

    //     const vaa = await getVAA(asset);

    //     const msg0 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: oraclecontractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: ausdContractAddress,
    //       sender: senderAddress,
    //       msg,
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg0, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const liquidateTroves = async (
    //     senderAddress: string,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     const vaa = await getVAA(asset);

    //     const msg0 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: oraclecontractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress,
    //       sender: senderAddress,
    //       msg: { liquidate_troves: {} },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg0, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const liquidateTrovesV2 = async (
    //     senderAddress: string,
    //     owner: string,
    //     asset: CollateralAsset = defaultAsset
    //   ) => {
    //     const vaa = await getVAA(asset);

    //     const msg0 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: oraclecontractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         update_price_feeds: {
    //           data: [vaa],
    //         },
    //       },
    //       funds: [coin("23", asset.denom)],
    //     });

    //     const msg1 = MsgExecuteContractCompat.fromJSON({
    //       contractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         liquidate_troves: {
    //           liquidation_list: [owner],
    //         },
    //       },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [msg0, msg1],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const updateReward = async (senderAddress: string) => {
    //     const unstake = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: contractAddress,
    //       sender: senderAddress,
    //       msg: {
    //         unstake: {
    //           amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal),
    //         },
    //       },
    //     });

    //     const msg = {
    //       send: {
    //         contract: contractAddress,
    //         amount: getRequestAmount(updateRewardAmount, baseCoin.ausdDecimal),
    //         msg: jsonToBinary({ stake: {} }),
    //       },
    //     };

    //     const stake = MsgExecuteContractCompat.fromJSON({
    //       contractAddress: ausdContractAddress,
    //       sender: senderAddress,
    //       msg,
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: [unstake, stake],
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    //   const withdrawLiquidationGains = async (senderAddress: string) => {
    //     const msg = MsgExecuteContractCompat.fromJSON({
    //       contractAddress,
    //       sender: senderAddress,
    //       msg: { withdraw_liquidation_gains: {} },
    //     });

    //     return await msgBroadcastClient.broadcast({
    //       msgs: msg,
    //       injectiveAddress: senderAddress,
    //     });
    //   };

    return {
        getTotalCollateralAmounts: (x?: any, y?: any, z?: any, s?: any) => { },
        getTotalDebtAmount: (x?: any, y?: any, z?: any, s?: any) => { },
        getTrove: (x?: any, y?: any, z?: any, s?: any) => { },
        getStake: (x?: any, y?: any, z?: any, s?: any) => { },
        getTotalStake: (x?: any, y?: any, z?: any, s?: any) => { },
        getCollateralPrice: (x?: any, y?: any, z?: any, s?: any) => { },
        getAusdBalance: (x?: any, y?: any, z?: any, s?: any) => { },
        getAusdInfo: (x?: any, y?: any, z?: any, s?: any) => { },
        getReward: (x?: any, y?: any, z?: any, s?: any) => { },
        openTrove,
        addCollateral: (x?: any, y?: any, z?: any, s?: any) => { },
        removeCollateral: (x?: any, y?: any, z?: any, s?: any) => { },
        borrowLoan: (x?: any, y?: any, z?: any, s?: any) => { },
        repayLoan: (x?: any, y?: any, z?: any, s?: any) => { },
        stake: (x?: any, y?: any, z?: any, s?: any) => { },
        unstake: (x?: any, y?: any, z?: any, s?: any) => { },
        redeem: (x?: any, y?: any, z?: any, s?: any) => { },
        liquidateTroves: (x?: any, y?: any, z?: any, s?: any) => { },
        liquidateTrovesV2: (x?: any, y?: any, z?: any, s?: any) => { },
        withdrawLiquidationGains: (x?: any, y?: any, z?: any, s?: any) => { },
        updateReward: (x?: any, y?: any, z?: any, s?: any) => { },
    };
};