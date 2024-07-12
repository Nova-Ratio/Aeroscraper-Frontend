import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const hederaAsset: CollateralAsset = {
    name: "hedera",
    shortName: "HBAR",
    denom: "hbar",
    decimal: 8,
    ausdDecimal: 18,
    imageURL: "/images/token-images/hedera.png",
    priceId: "0x3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd",
    priceServiceUrl: "https://hermes.pyth.network",
    oracleContractAddress: "" as string
}


export const collateralAssets: CollateralAsset[] = [
    hederaAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.HEDERA]: hederaAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})