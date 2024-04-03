import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const archAsset: CollateralAsset = {
    name: "Archway",
    shortName: "ARCH",
    denom: "aarch",
    decimal: 18,
    ausdDecimal: 18,
    imageURL: "/images/token-images/archway-coin.png",
    priceId: "",
    priceServiceUrl: "",
    oracleContractAddress: ''
}

export const collateralAssets: CollateralAsset[] = [
    archAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.ARCHWAY]: archAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})