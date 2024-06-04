import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const archAsset: CollateralAsset = {
    name: "Nibiru",
    shortName: "NIBI",
    denom: "unibi",
    decimal: 6,
    ausdDecimal: 18,
    imageURL: "/images/token-images/nibi-logomark-profile-pic.dcbb6a8d.svg",
    priceId: "",
    priceServiceUrl: "",
    oracleContractAddress: ''
}

export const collateralAssets: CollateralAsset[] = [
    archAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.NIBIRU]: archAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})