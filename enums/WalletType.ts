export enum WalletType {
    LEAP = "leap",
    KEPLR = "keplr",
    FIN = "fin",
    COMPASS = "compass",
    METAMASK = "metamask",
    NOT_SELECTED = "not_selected"
}

export const WalletInfoMap: Record<WalletType, { name: string, imageURL: string, thumbnailURL: string }> = {
    [WalletType.KEPLR]: {
        name: 'Keplr',
        imageURL: '/images/keplr.svg',
        thumbnailURL: '/images/keplr-icon.svg'
    },
    [WalletType.LEAP]: {
        name: 'Leap',
        imageURL: '/images/leap.svg',
        thumbnailURL: '/images/leap-icon.png'
    },
    [WalletType.FIN]: {
        name: 'Fin',
        imageURL: '/images/fin.png',
        thumbnailURL: '/images/fin-icon.png'
    },
    [WalletType.COMPASS]: {
        name: 'Compass',
        imageURL: '/images/compass.png',
        thumbnailURL: '/images/compass-icon.png'
    },
    [WalletType.METAMASK]: {
        name: 'Metamask',
        imageURL: '/images/metamask.svg',
        thumbnailURL: '/images/metamask-icon.svg'
    },
    [WalletType.NOT_SELECTED]: {
        name: '',
        imageURL: '',
        thumbnailURL: ''
    }
}
