import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const injAsset: CollateralAsset = {
    name: "Injective",
    shortName: "INJ",
    denom: "inj",
    decimal: 18,
    ausdDecimal: 18,
    imageURL: "/images/token-images/inj.svg",
    priceId: "2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3",
    priceServiceUrl: "https://hermes-beta.pyth.network/",
    oracleContractAddress: process.env.NEXT_PUBLIC_INJECTIVE_ORACLE_CONTRACT_ADDRESS as string
}

export const collateralAssets: CollateralAsset[] = [
    injAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.INJECTIVE]: injAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})