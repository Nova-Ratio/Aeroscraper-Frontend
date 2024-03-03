import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";

export const WalletsByChainName: Record<ChainName, WalletType[]> = {
    [ChainName.SEI]: [
        WalletType.LEAP,
        WalletType.KEPLR,
        // WalletType.LEDGER,
        // WalletType.COSMOSTATION
    ],
}