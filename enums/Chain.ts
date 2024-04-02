export enum ChainName {
    ARCHWAY = "archway"
}

export type ChainNavigator = {
    chainName: string
    image: string
    url: string
    env: string
    isSelected?: boolean
}