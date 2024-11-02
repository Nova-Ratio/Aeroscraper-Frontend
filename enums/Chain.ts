export enum ChainName {
    INJECTIVE = "injective",
    EVM = "evm",
    AVAX = "avalanche"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}