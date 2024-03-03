import { AppContextState, useAppContext } from "@/contexts/AppProvider";
import { ChainName } from "@/enums/Chain";
import { useChain } from "@cosmos-kit/react"
import { ChainContext } from "@cosmos-kit/core"
import { useMemo } from "react";
import { BaseCoin, WalletInfo } from "@/types/types";
import { BaseCoinByChainName } from "@/constants/chainConstants";
import { WalletType } from "@/enums/WalletType";

type ChainAdapterValue = ChainContext & AppContextState & {
    baseCoin?: BaseCoin;
    walletInfo?: WalletInfo;
}

const useChainAdapter = () => {
    const appContextValue = useAppContext();
    const chainContextValue = useChain(appContextValue.selectedChainName ?? ChainName.SEI);

    const address = useMemo<string | undefined>(() => chainContextValue.address, [chainContextValue.address]);

    const username = useMemo<string | undefined>(() => chainContextValue.username, [chainContextValue.username]);

    const walletInfo = useMemo<WalletInfo | undefined>(() =>
        chainContextValue.isWalletConnected ?
            {
                name: (chainContextValue.wallet?.name ?? '') as WalletType,
                prettyName: chainContextValue.wallet?.prettyName ?? '',
                logo: (chainContextValue.wallet?.logo ?? '') as string
            } :
            undefined,
        [chainContextValue.isWalletConnected, chainContextValue.wallet]
    );

    const isWalletConnected = useMemo(() => chainContextValue.isWalletConnected, [chainContextValue.isWalletConnected])

    const isWalletConnecting = useMemo(() => chainContextValue.isWalletConnecting, [chainContextValue.isWalletConnecting])

    const baseCoin = useMemo<BaseCoin | undefined>(() => appContextValue.selectedChainName ? BaseCoinByChainName[appContextValue.selectedChainName] : undefined, [appContextValue.selectedChainName]);

    const value = useMemo<ChainAdapterValue>(() => ({
        ...appContextValue,
        ...chainContextValue,
        baseCoin,
        address,
        walletInfo,
        isWalletConnected,
        isWalletConnecting,
        username
    }), [appContextValue, chainContextValue, address, baseCoin, walletInfo, isWalletConnected, isWalletConnecting, username])

    return value;
}

export default useChainAdapter;