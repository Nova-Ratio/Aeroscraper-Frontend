import { ChainName } from "@/enums/Chain";
import { CollateralAsset } from "@/types/types";


const xionAsset: CollateralAsset = {
    name: "Aeroscraper Token",
    shortName: "AST",
    denom: "AST",
    cw20Denom: "AST",
    decimal: 18,
    ausdDecimal: 18,
    imageURL: "/images/token-images/ast.svg",
    priceId: "",
    priceServiceUrl: "",
    oracleContractAddress: ''
}

export const collateralAssets: CollateralAsset[] = [
    xionAsset
]

export const DefaultAssetByChainName: Record<ChainName, CollateralAsset> = {
    [ChainName.XION]: xionAsset
}

export const assetByDenom: Record<string, CollateralAsset | undefined> = Object
    .values(DefaultAssetByChainName)
    .reduce<Record<string, CollateralAsset | undefined>>((acc, asset) => {
        acc[asset.denom] = asset;
        return acc;
    }, {})