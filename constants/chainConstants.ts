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
    },
    [ChainName.METAMASK]: {
        name: "ETH",
        denom: "eth",
        image: "/images/token-images/eth.svg",
        tokenImage: "/images/token-images/eth.svg",
        decimal: 18,
        ausdDecimal: 18
    },
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.INJECTIVE]: {
        txDetailUrl: "https://explorer.injective.network/transaction/",
        accountUrl: "https://explorer.injective.network/account/"
    },
    [ChainName.METAMASK]: {
        txDetailUrl: "https://etherscan.io/tx/",
        accountUrl: "https://etherscan.io/address/"
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
    },
    [ChainName.METAMASK]: {
        name: ChainName.METAMASK,
        displayName: "ETH",
        logo: "/images/wallet-images/metamask-icon.png",
        bech32Prefix: "eth"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {
    [ChainName.INJECTIVE]: { priceId: "2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3", serviceUrl: "https://hermes-beta.pyth.network/" },
    [ChainName.METAMASK]: { priceId: "", serviceUrl: "" }
}

export const appChainURLs: ChainNavigator[] = [
    { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscrapertest.tech", env: "Mainnet" },
    { chainName: "Sepolia", image: "/images/wallet-images/metamask-icon.png", url: "https://evm.aeroscrapertest.tech", env: "Testnet", isSelected: true },
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscrapertest.tech", env: "Testnet", isSelected: true },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Testnet" }
]

export const MANAGEMENT_FEE = 0.005;