import { WalletType } from "@/enums/WalletType";
import { BaseCoin, ClientEnum } from "../types/types";
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
    ],
    [ClientEnum.SHARDEUM]: [
        WalletType.METAMASK
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
    },
    [WalletType.METAMASK]: {
        image: "",
        thumbnail: ""
    }
}

export const ClientImagesByName: Record<ClientEnum, { image: string, thumbnail: string }> = {
    [ClientEnum.COSMWASM]: {
        image: "/images/cosmwasm.png",
        thumbnail: ""
    },
    [ClientEnum.ARCHWAY]: {
        image: "/images/archway.png",
        thumbnail: ""
    },
    [ClientEnum.SHARDEUM]: {
        image: "/images/metamask-icon.svg",
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
        name: "ARCH",
        denom: "ARCH",
        image: "/images/archway-coin.png",
    },
    [ClientEnum.SHARDEUM]: {
        name: "SHM",
        denom: "SHM",
        image: "/images/archway-coin.png",
    }
}

export const getBaseCoinByClient = (clientType?: ClientEnum) => {
    return !isNil(clientType) ? BaseCoinByClient[clientType] : BaseCoinByClient[ClientEnum.COSMWASM]
}