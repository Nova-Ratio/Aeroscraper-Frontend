export enum ChainName {
    INJECTIVE = "injective",
    METAMASK = "metamask"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}