import { WalletType } from "@/enums/WalletType";
import { BaseCoin, ClientEnum } from "@/types/types";
import { isNil } from "lodash";

export const WalletByClient: Record<ClientEnum, WalletType[]> = {
    [ClientEnum.COSMWASM]: [
        WalletType.LEAP,
        WalletType.COMPASS,
        WalletType.FIN,
        WalletType.KEPLR
    ],
    [ClientEnum.ARCHWAY]: [
        WalletType.LEAP,
        WalletType.KEPLR
    ]
}

export const WalletImagesByName: Record<WalletType, { image: string, thumbnail: string }> = {
    [WalletType.KEPLR]: {
        image: "/images/keplr-dark.svg",
        thumbnail: ""
    },
    [WalletType.LEAP]: {
        image: "/images/leap-dark.svg",
        thumbnail: ""
    },
    [WalletType.FIN]: {
        image: "/images/fin.png",
        thumbnail: ""
    },
    [WalletType.COMPASS]: {
        image: "/images/compass.png",
        thumbnail: ""
    },
    [WalletType.NOT_SELECTED]: {
        image: "",
        thumbnail: ""
    }
}

export const ClientImagesByName: Record<ClientEnum, { image: string, thumbnail: string }> = {
    [ClientEnum.COSMWASM]: {
        image: "/images/sei-network.png",
        thumbnail: ""
    },
    [ClientEnum.ARCHWAY]: {
        image: "/images/archway.svg",
        thumbnail: ""
    }
}

export const BaseCoinByClient: Record<ClientEnum, BaseCoin> = {
    [ClientEnum.COSMWASM]: {
        name: "SEI",
        denom: "usei",
        image: "/images/sei.png",
    },
    [ClientEnum.ARCHWAY]: {
        name: "ATOM",
        denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB",
        image: "/images/ATOM.svg",
    }
}

export const getBaseCoinByClient = (clientType?: ClientEnum) => {
    return !isNil(clientType) ? BaseCoinByClient[clientType] : BaseCoinByClient[ClientEnum.COSMWASM]
}

export const getContractAddressesByClient = (clientType?: ClientEnum) => {
    if (clientType === ClientEnum.COSMWASM) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string
        }
    }
    else if (clientType === ClientEnum.ARCHWAY) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_ARCH_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_ARCH_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string
    }
}