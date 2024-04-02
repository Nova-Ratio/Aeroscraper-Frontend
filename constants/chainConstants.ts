import { ChainName, ChainNavigator } from "@/enums/Chain";
import { BaseCoin, ChainInfo } from "@/types/types";
import { chains } from 'chain-registry'

const visibleChains: ChainName[] = [
    ChainName.ARCHWAY
]

export const availableChains = Object.values(chains).filter(chain => visibleChains.includes(chain.chain_name as ChainName));

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.ARCHWAY]: {
        name: "ARCHWAY",
        denom: "aarch",
        image: "/images/token-images/archway-coin.png",
        tokenImage: "/images/token-images/atom.svg",
        decimal: 6,
        ausdDecimal: 6
    }
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.ARCHWAY]: {
        txDetailUrl: "https://www.mintscan.io/archway/transactions/",
        accountUrl: "https://www.mintscan.io/archway/account/"
    }
}

export const getContractAddressesByChain = (chainName?: ChainName) => {
    if (chainName === ChainName.ARCHWAY) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_ARCHWAY_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_ARCHWAY_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_ARCHWAY_ORACLE_CONTRACT_ADDRESS as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.ARCHWAY]: {
        name: ChainName.ARCHWAY,
        displayName: "ARCH",
        logo: "/images/token-images/archway-coin.png",
        bech32Prefix: "archway"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.ARCHWAY]: { priceId: "b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819", serviceUrl: "https://hermes.pyth.network/" }
}

export const appChainURLs: ChainNavigator[] = [
    /* { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscraper.io/app/dashboard", env: "Mainnet" }, */
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscraper.io/app/dashboard", env: "Mainnet" },
    { chainName: "Archway", image: "/images/token-images/archway-coin.png", url: "https://archway.aeroscraper.io/app/dashboard", env: "Mainnet", isSelected: true },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Testnet" }
]

export const MANAGEMENT_FEE = 0.005;