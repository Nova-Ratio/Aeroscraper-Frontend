import { CollateralInfo } from "@/contracts/app/types";
import { ChainName } from "@cosmos-kit/core";

export type RiskyTrovesResponse = {
    troves: {
        nodes: {
            owner: string;
            liquidityThreshold: number;
        }[]
    }
}

export type RiskyTrovesModelV1 = {
    owner: string;
    liquidityThreshold: number;
    collateralAmount: number;
    debtAmount: number;
}

export type RiskyTrovesModelV2 = {
    owner: string;
    liquidityThreshold: number;
    collateralAmounts: CollateralInfo[];
    debtAmount: number;
    totalDollarValue: number;
    baseCollateralAmount: number;
}

export type TotalTrovesResponse = {
    troves: {
        totalCount: number
    }
}

export type BaseCoin = {
    name: string,
    denom: string,
    image: string,
    tokenImage: string,
    decimal: number,
    ausdDecimal: number
}

export type WalletInfo = {
    name: string;
    prettyName: string;
    logo: string;
}

export type CollateralAsset = {
    name: string;
    shortName: string;
    denom: string;
    decimal: number;
    ausdDecimal: number;
    imageURL: string;
    priceId: string;
    priceServiceUrl: string;
    oracleContractAddress: string;
}

export type ChainInfo = {
    name: ChainName;
    displayName: string;
    logo: string;
    bech32Prefix: string;
}

export type ICRGraphqlNode = {
    owner: string;
    ratio: number;
}

export type ICRGraphqlResponse = {
    nextTrove: {
        nodes: ICRGraphqlNode[];
    },
    prevTrove: {
        nodes: ICRGraphqlNode[];
    }
}

export type redeemICRresponse = {
    troves: {
        nodes: {
            collaterals:{
                denom: string
                amount: string
            }[];
            debtAmount: string
        }[]
    }
}