import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { WalletInfo } from "@/types/types";

export const WalletsByChainName: Record<ChainName, WalletType[]> = {
    [ChainName.ARCHWAY]: [
        WalletType.LEAP,
        WalletType.KEPLR,
        WalletType.NINJI,
        // WalletType.LEDGER,
        WalletType.COSMOSTATION
    ]
}

export const metamaskWalletInfo: WalletInfo = {
    name: WalletType.METAMASK,
    prettyName: 'Metamask',
    logo: '/images/wallet-images/metamask-icon.png'
}