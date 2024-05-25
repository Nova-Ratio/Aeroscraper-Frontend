import { ChainName, ChainNavigator } from "@/enums/Chain";
import { AppVersion, BaseCoin, ChainInfo } from "@/types/types";
import { chains } from 'chain-registry'

const visibleChains: ChainName[] = [
    ChainName.XION
]

export const availableChains = Object.values(chains).filter(chain => visibleChains.includes(chain.chain_name as ChainName));

export const BaseCoinByChainName: Record<ChainName, BaseCoin> = {
    [ChainName.XION]: {
        name: "XION",
        denom: "AST",
        cw20Denom: "AST",
        image: "/images/token-images/xion.png",
        tokenImage: "/images/token-images/ast.svg",
        decimal: 6,
        ausdDecimal: 18
    }
}

export const BaseCoinByDenom = Object.values(BaseCoinByChainName).reduce<Record<string, BaseCoin>>((acc, baseCoin) => {
    acc[baseCoin.denom] = baseCoin;
    return acc;
}, {});

export const TransactionDomainByChainName: Record<ChainName, { accountUrl: string, txDetailUrl: string }> = {
    [ChainName.XION]: {
        txDetailUrl: "https://explorer.burnt.com/xion-testnet-1/tx/",
        accountUrl: "https://explorer.burnt.com/xion-testnet-1/account/"
    }
}

export const getContractAddressesByChain = (appVersion: AppVersion, chainName?: ChainName) => {
    if (chainName === ChainName.XION) {
        return {
            contractAddress: process.env.NEXT_PUBLIC_AERO_XION as string,
            ausdContractAddress: process.env.NEXT_PUBLIC_CW20_AUSD_XION as string,
            oraclecontractAddress: process.env.NEXT_PUBLIC_ORACLE_HELPER_XION as string,
            cw20CustomToken: process.env.NEXT_PUBLIC_CW20_CUSTOM_TOKEN_XION as string,
            customTokenMinter: process.env.NEXT_PUBLIC_CW20_MINTER_XION as string
        }
    }

    return {
        contractAddress: '',
        ausdContractAddress: '',
        oraclecontractAddress: '',
    }
}

export const ChainInfoByName: Record<ChainName, ChainInfo> = {
    [ChainName.XION]: {
        name: ChainName.XION,
        displayName: "XION",
        logo: "/images/token-images/xion.png",
        bech32Prefix: "xion"
    }
}

export const priceIdByChainName: Record<ChainName, { priceId: string, serviceUrl: string }> = {

    [ChainName.XION]: { priceId: "", serviceUrl: "" }
}

export const appChainURLs: ChainNavigator[] = [
    /* { chainName: "Sei", image: "/images/token-images/sei.png", url: "https://sei.aeroscrapertest.tech", env: "Mainnet" }, */
    { chainName: "Injective", image: "/images/token-images/inj.svg", url: "https://inj.aeroscraper.io", env: "Mainnet" },
    { chainName: "Archway", image: "/images/token-images/archway-coin.png", url: "https://archway.aeroscraper.io/app/dashboard", env: "Mainnet" },
    { chainName: "Xion", image: "/images/token-images/burntCircle.svg", url: "https://xion.aeroscrapertest.tech/app", env: "Testnet", isSelected: true }
]

export const MANAGEMENT_FEE = 0.005;