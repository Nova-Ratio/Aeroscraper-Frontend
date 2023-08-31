import { WalletType } from "@/enums/WalletType";
import { ClientEnum } from "@/types/types";

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
        image: "/images/cosmwasm.png",
        thumbnail: ""
    },
    [ClientEnum.ARCHWAY]: {
        image: "/images/archway.png",
        thumbnail: ""
    }
}