export enum ChainName {
    INJECTIVE = "injective",
    EVM = "evm"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}