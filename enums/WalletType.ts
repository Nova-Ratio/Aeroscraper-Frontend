export enum WalletType {
    LEAP = "leap",
    KEPLR = "keplr",
    FIN = "fin",
    COMPASS = "compass",
    METAMASK = "metamask",
    NINJI = "ninji",
    NOT_SELECTED = "not_selected"
}

export const WalletInfoMap: Record<WalletType, { name: string, imageURL: string, thumbnailURL: string }> = {
    [WalletType.KEPLR]: {
        name: 'Keplr',
        imageURL: '/images/wallet-images/keplr.svg',
        thumbnailURL: '/images/wallet-images/keplr-icon.svg'
    },
    [WalletType.LEAP]: {
        name: 'Leap',
        imageURL: '/images/wallet-images/leap.svg',
        thumbnailURL: '/images/wallet-images/leap-icon.png'
    },
    [WalletType.FIN]: {
        name: 'Fin',
        imageURL: '/images/wallet-images/fin.png',
        thumbnailURL: '/images/wallet-images/fin-icon.png'
    },
    [WalletType.COMPASS]: {
        name: 'Compass',
        imageURL: '/images/wallet-images/compass.png',
        thumbnailURL: '/images/wallet-images/compass-icon.png'
    },
    [WalletType.METAMASK]: {
        name: 'Metamask',
        imageURL: '/images/wallet-images/metamask.png',
        thumbnailURL: '/images/wallet-images/metamask-icon.png'
    },
    [WalletType.NINJI]: {
        name: 'Ninji',
        imageURL: '/images/wallet-images/ninji.png',
        thumbnailURL: '/images/wallet-images/ninji-icon.png'
    },
    [WalletType.NOT_SELECTED]: {
        name: '',
        imageURL: '',
        thumbnailURL: ''
    }
}