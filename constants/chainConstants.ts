import { ChainName, ChainNavigator } from "@/enums/Chain";
import { BaseCoin, ChainInfo } from "@/types/types";

const visibleChains: ChainName[] = [
    ChainName.HEDERA
]

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.HEDERA]: {
        name: "HBAR",
        denom: "hbar",
        image: "/images/token-images/hedera.png",
        tokenImage: "/images/token-images/hedera.png",
        decimal: 18,
        ausdDecimal: 18
    },
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.HEDERA]: {
        txDetailUrl: "",
        accountUrl: ""
    }
}

export const getContractAddressesByChain = (chainName?: ChainName) => {
    if (chainName === ChainName.HEDERA) {
        return {
            contractAddress: "" as string,
            ausdContractAddress: "" as string,
            oraclecontractAddress: "" as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.HEDERA]: {
        name: ChainName.HEDERA,
        displayName: "HEDERA",
        logo: "/images/token-images/hedera.png",
        bech32Prefix: "hbax"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.HEDERA]: { priceId: "", serviceUrl: "" }
}

export const appChainURLs: ChainNavigator[] = [
    { chainName: "Hedera", image: "/images/token-images/hedera.svg", url: "https://hedera.aeroscrapertest.tech", env: "Testnet", isSelected: true },
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscraper.io/app/dashboard/", env: "Mainnet", isSelected: false },
    { chainName: "Archway", image: "/images/token-images/archway-coin.png", url: "https://arch.aeroscraper.io/app/dashboard/", env: "Mainnet", isSelected: false },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Testnet" }
]

export const MANAGEMENT_FEE = 0.005;