import { WalletType } from "@/enums/WalletType";
import { BaseCoin, ClientEnum } from "@/types/types";

export const WalletByClient: Record<ClientEnum, WalletType[]> = {
    [ClientEnum.COSMWASM]: [
        WalletType.LEAP,
        WalletType.COMPASS,
        WalletType.FIN,
        WalletType.KEPLR
    ],
    [ClientEnum.ARCHWAY]: [
        WalletType.LEAP,
        WalletType.KEPLR,
    ],
    [ClientEnum.NEUTRON]: [
        WalletType.KEPLR,
    ],
    [ClientEnum.INJECTIVE]: [
        WalletType.KEPLR,
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
        thumbnail: "sei"
    },
    [ClientEnum.ARCHWAY]: {
        image: "/images/archway.svg",
        thumbnail: "archway"
    },
    [ClientEnum.NEUTRON]: {
        image: "/images/neutron-network.svg",
        thumbnail: "neutron"
    },
    [ClientEnum.INJECTIVE]: {
        image: "/images/injective.svg",
        thumbnail: "injective"
    }
}

export const ClientTransactionUrlByName: Record<ClientEnum, { accountUrl: string, txDetailUrl: string }> = {
    [ClientEnum.COSMWASM]: {
        txDetailUrl: "https://sei.explorers.guru/transaction/",
        accountUrl: "https://sei.explorers.guru/account/"
    },
    [ClientEnum.ARCHWAY]: {
        txDetailUrl: "https://www.mintscan.io/archway/transactions/",
        accountUrl: "https://www.mintscan.io/archway/account/"
    },
    [ClientEnum.NEUTRON]: {
        txDetailUrl: "https://neutron.celat.one/transactions/",
        accountUrl: "https://neutron.celat.one/account/"
    },
    [ClientEnum.INJECTIVE]: {
        txDetailUrl: "",
        accountUrl: ""
    }
}

export const BaseCoinByClient: Record<ClientEnum, BaseCoin> = {
    [ClientEnum.COSMWASM]: {
        name: "SEI",
        denom: "usei",
        image: "/images/sei.png",
        decimal: 6,
        ausdDecimal: 6
    },
    [ClientEnum.ARCHWAY]: {
        name: "ATOM",
        denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
        image: "/images/atom.svg",
        decimal: 6,
        ausdDecimal: 6
    },
    [ClientEnum.NEUTRON]: {
        name: "NTRN",
        denom: "untrn",
        image: "/images/neutron.svg",
        decimal: 6,
        ausdDecimal: 6
    },
    [ClientEnum.INJECTIVE]: {
        name: "INJ",
        denom: "inj",
        image: "/images/inj.svg",
        decimal: 18,
        ausdDecimal: 12
    }
}

export const getBaseCoinByClient = (clientType?: ClientEnum) => {
    return clientType && BaseCoinByClient[clientType];
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
            oraclecontractAddress: ''
        }
    } else if (clientType === ClientEnum.NEUTRON) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_NEUTRON_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_NEUTRON_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_NEUTRON_ORACLE_CONTRACT_ADDRESS as string
        }
    } else if (clientType === ClientEnum.INJECTIVE) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_INJECTIVE_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_INJECTIVE_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_INJECTIVE_ORACLE_CONTRACT_ADDRESS as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}