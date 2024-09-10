import { ChainName, ChainNavigator } from "@/enums/Chain";
import { BaseCoin, ChainInfo } from "@/types/types";
import { chains } from 'chain-registry'

const visibleChains: ChainName[] = [
    ChainName.NIBIRU
]

export const availableChains = Object.values(chains).filter(chain => visibleChains.includes(chain.chain_name as ChainName));

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.NIBIRU]: {
        name: "NIBIRU",
        denom: "unibi",
        symbol: "NIBI",
        image: "/images/token-images/nibi-logomark-profile-pic.dcbb6a8d.svg",
        tokenImage: "/images/token-images/nibi-logomark-profile-pic.dcbb6a8d.svg",
        decimal: 6,
        ausdDecimal: 18
    }
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.NIBIRU]: {
        txDetailUrl: "https://nibiru.explorers.guru/transaction/",
        accountUrl: "https://nibiru.explorers.guru/account/"
    }
}

export const getContractAddressesByChain = (chainName?: ChainName) => {
    if (chainName === ChainName.NIBIRU) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_NIBIRU_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_NIBIRU_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_NIBIRU_ORACLE_CONTRACT_ADDRESS as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.NIBIRU]: {
        name: ChainName.NIBIRU,
        displayName: "NIBI",
        logo: "/images/token-images/nibi-logomark-profile-pic.dcbb6a8d.svg",
        bech32Prefix: "nibiru"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.NIBIRU]: { priceId: "", serviceUrl: "" }
}

export const appChainURLs: ChainNavigator[] = [
    /* { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscraper.io/app/dashboard", env: "Mainnet" }, */
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscraper.io/app/dashboard", env: "Mainnet" },
    { chainName: "Nibiru", image: "/images/token-images/nibi-logomark-profile-pic.dcbb6a8d.svg", url: "https://nibi.aeroscraper.io/app/dashboard", env: "Mainnet", isSelected: true },
    { chainName: "Archway", image: "/images/token-images/archway-coin.png", url: "https://arch.aeroscraper.io/app/dashboard", env: "Mainnet" },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscraper.io/app", env: "Testnet" }
]

export const MANAGEMENT_FEE = 0.005;