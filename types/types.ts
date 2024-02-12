import { CollateralInfo } from "@/contracts/app/types";
import { useAbstraxionSigningClient } from "@/hooks/xion";
import { ChainName } from "@cosmos-kit/core";

export type RiskyTrovesResponse = {
    troves: {
        nodes: {
            owner: string;
            liquidityThreshold: number;
        }[]
    }
}

export type RiskyTrovesModel = {
    owner: string;
    liquidityThreshold: number;
    collateralAmounts: CollateralInfo[];
    debtAmount: number;
    totalDollarValue: number;
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