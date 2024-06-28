export enum ChainName {
    HEDERA = "hedera"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}