import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const archAsset: CollateralAsset = {
    name: "Archway",
    shortName: "ARCH",
    denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
    decimal: 6,
    ausdDecimal: 6,
    imageURL: "/images/token-images/archway-coin.png",
    priceId: "b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819",
    priceServiceUrl: "https://hermes.pyth.network/",
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