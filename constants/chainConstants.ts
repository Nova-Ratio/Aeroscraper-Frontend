import { ChainName, ChainNavigator } from "@/enums/Chain";
import { BaseCoin, ChainInfo } from "@/types/types";
import { chains } from 'chain-registry'

const visibleChains: ChainName[] = [
    ChainName.INJECTIVE
]

export const availableChains = Object.values(chains).filter(chain => visibleChains.includes(chain.chain_name as ChainName));

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.INJECTIVE]: {
        name: "INJ",
        denom: "inj",
        image: "/images/token-images/inj.svg",
        tokenImage: "/images/token-images/inj.svg",
        decimal: 18,
        ausdDecimal: 18
    }
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.INJECTIVE]: {
        txDetailUrl: "https://explorer.injective.network/transaction/",
        accountUrl: "https://explorer.injective.network/account/"
    }
}

export const getContractAddressesByChain = (chainName?: ChainName) => {
    if (chainName === ChainName.INJECTIVE) {
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

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.INJECTIVE]: {
        name: ChainName.INJECTIVE,
        displayName: "INJ",
        logo: "/images/token-images/inj.svg",
        bech32Prefix: "inj"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.INJECTIVE]: { priceId: "7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592", serviceUrl: "https://hermes.pyth.network/" }
}

export const appChainURLs: ChainNavigator[] = [
    /* { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscraper.io/app/dashboard", env: "Mainnet" }, */
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscraper.io/app/dashboard", env: "Mainnet", isSelected: true },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Testnet" }
]

export const MANAGEMENT_FEE = 0.005;