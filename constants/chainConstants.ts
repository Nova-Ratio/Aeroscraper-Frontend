import { ChainName, ChainNavigator } from "@/enums/Chain";
import { BaseCoin, ChainInfo } from "@/types/types";
import { chains } from 'chain-registry'

const visibleChains: ChainName[] = [
    ChainName.SEI
]

export const availableChains = Object.values(chains).filter(chain => visibleChains.includes(chain.chain_name as ChainName));

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.SEI]: {
        name: "SEI",
        denom: "usei",
        image: "/images/token-images/sei.png",
        tokenImage: "/images/token-images/sei.png",
        decimal: 6,
        ausdDecimal: 6
    },
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.SEI]: {
        txDetailUrl: "https://sei.explorers.guru/transaction/",
        accountUrl: "https://sei.explorers.guru/account/"
    },
}

export const getContractAddressesByChain = (chainName?: ChainName) => {
    if (chainName === ChainName.SEI) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_AUSD_CONTRACT_ADDRESS as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.SEI]: {
        name: ChainName.SEI,
        displayName: "SEI",
        logo: "/images/token-images/sei.png",
        bech32Prefix: "sei"
    },
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.SEI]: { priceId: "53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb", serviceUrl: "https://hermes.pyth.network/" },
}

export const appChainURLs: ChainNavigator[] = [
    { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscrapertest.tech", env: "Mainnet" },
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscrapertest.tech", env: "Testnet" },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Mainnet" }
]