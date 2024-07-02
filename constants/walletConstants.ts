import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { WalletInfo } from "@/types/types";

export const WalletsByChainName: Record<ChainName, WalletType[]> = {
    [ChainName.HEDERA]: [
        WalletType.BLADE,
        WalletType.HASHPACK,
        WalletType.WALLETCONNECT
    ]
}

export const Wallets: WalletInfo[] = [
    {
        name: WalletType.BLADE,
        walletPrettyName: 'Blade',
        logo: '/images/wallet-images/blade.png'
    },
    {
        name: WalletType.HASHPACK,
        walletPrettyName: 'Hashpack',
        logo: '/images/wallet-images/hashpack.png'
    },
    {
        name: WalletType.WALLETCONNECT,
        walletPrettyName: 'WalletConnect',
        logo: '/images/wallet-images/walletconnect.png'
    }
]