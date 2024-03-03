import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";

const seiAsset: CollateralAsset = {
    name: "SEI",
    shortName: "SEI",
    denom: "usei",
    decimal: 6,
    ausdDecimal: 6,
    imageURL: "/images/token-images/sei.png",
    priceId: "53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb",
    priceServiceUrl: "https://hermes.pyth.network/",
    oracleContractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as string
}

export const collateralAssets: CollateralAsset[] = [
    seiAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.SEI]: seiAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})