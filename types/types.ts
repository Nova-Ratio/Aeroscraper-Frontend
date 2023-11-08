import { SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { InjectiveStargate } from "@injectivelabs/sdk-ts";

export enum ClientEnum {
    INJECTIVE = "INJECTIVE",
    SEI = "SEI",
    ARCHWAY = "ARCHWAY",
    NEUTRON = "NEUTRON"
}

export type RiskyTrovesResponse = {
    troves: {
        nodes: {
            owner: string;
            liquidityThreshold: number;
        }[]
    }
}

export type RiskyTroves = {
    owner: string;
    liquidityThreshold: number;
    collateralAmount: number;
    debtAmount: number;
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
    decimal:number,
    ausdDecimal:number
}

export const isClientInjective = (client: SigningArchwayClient | SigningCosmWasmClient | InjectiveStargate.InjectiveSigningStargateClient, clientEnum?: ClientEnum): client is InjectiveStargate.InjectiveSigningStargateClient => clientEnum === ClientEnum.INJECTIVE;