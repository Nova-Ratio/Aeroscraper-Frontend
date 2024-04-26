export enum ChainName {
    NIBIRU = "nibiru"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}