import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const injAsset: CollateralAsset = {
    name: "Injective",
    shortName: "INJ",
    denom: "inj",
    decimal: 18,
    ausdDecimal: 18,
    imageURL: "/images/token-images/inj.svg",
    priceId: "7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592",
    priceServiceUrl: "https://hermes.pyth.network/",
    oracleContractAddress: process.env.NEXT_PUBLIC_INJECTIVE_ORACLE_CONTRACT_ADDRESS as string
}
const evm: CollateralAsset = {
    name: "evm",
    shortName: "ETH",
    denom: "eth",
    decimal: 18,
    ausdDecimal: 18,
    imageURL: "/images/wallet-images/metamask-icon.png",
    priceId: "",
    priceServiceUrl: "",
    oracleContractAddress: process.env.NEXT_PUBLIC_INJECTIVE_ORACLE_CONTRACT_ADDRESS as string
}

export const collateralAssets: CollateralAsset[] = [
    injAsset,
    evm
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.INJECTIVE]: injAsset,
    [ChainName.EVM]: evm
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})