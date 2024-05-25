import { CollateralInfo } from "@/contracts/app/types";
import { ChainName } from "@/enums/Chain";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";

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
    cw20Denom?: string
}

export type WalletInfo = {
    name: string;
    prettyName: string;
    logo: string;
}

export enum AppVersion {
    V1 = "Version 1",
    V2 = "Version 2"
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
    cw20Denom?: string;
}

export type ChainInfo = {
    name: ChainName;
    displayName: string;
    logo: string;
    bech32Prefix: string;
}

export type AbstractionClient = ReturnType<typeof useAbstraxionSigningClient>['client'];

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
            collaterals: {
                denom: string
                amount: string
            }[];
            debtAmount: string
        }[]
    }
}