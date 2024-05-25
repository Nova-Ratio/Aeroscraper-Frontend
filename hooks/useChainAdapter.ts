import { AppContextState, useAppContext } from "@/contexts/AppProvider";
import { ChainName } from "@/enums/Chain";
import { useMemo } from "react";
import { BaseCoin, WalletInfo } from "@/types/types";
import { BaseCoinByChainName, ChainInfoByName } from "@/constants/chainConstants";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

type ChainAdapterValue = any & {
    baseCoin?: BaseCoin;
    walletInfo?: WalletInfo;
}

const useChainAdapter = () => {
    const { isConnected: isAbstraxionConnected } = useAbstraxionAccount();
    const appContextValue = useAppContext();

    const address = useMemo<string | undefined>(() =>
        appContextValue.userAddress
        , [appContextValue.selectedWallet, appContextValue.userAddress, appContextValue.selectedChainName]
    );

    const username = useMemo<string | undefined>(() =>
        appContextValue.selectedChainName === ChainName.XION ?
            ChainInfoByName[ChainName.XION].displayName : undefined

        , [appContextValue.selectedWallet, appContextValue.selectedChainName]
    );

    const walletInfo = useMemo<WalletInfo | undefined>(() =>
        (appContextValue.selectedChainName === ChainName.XION && isAbstraxionConnected) ?
            {
                name: ChainName.XION,
                prettyName: ChainInfoByName[ChainName.XION].displayName,
                logo: ChainInfoByName[ChainName.XION].logo
            }
            : undefined
        ,
        [appContextValue.selectedWallet, , appContextValue.selectedChainName, isAbstraxionConnected]
    );

    const isWalletConnected = useMemo(() =>
        isAbstraxionConnected
        , [appContextValue.userAddress, appContextValue.selectedWallet, appContextValue.selectedChainName, isAbstraxionConnected]
    )

    const isWalletConnecting = useMemo(() =>
        appContextValue.isConnecting,
        [appContextValue.isConnecting, appContextValue.selectedWallet]
    )

    const baseCoin = useMemo<BaseCoin | undefined>(() => appContextValue.selectedChainName ? BaseCoinByChainName[appContextValue.selectedChainName] : undefined, [appContextValue.selectedChainName]);

    const value = useMemo<ChainAdapterValue>(() => ({
        ...appContextValue,
        baseCoin,
        address,
        walletInfo,
        isWalletConnected,
        isWalletConnecting,
        username
    }), [appContextValue, address, baseCoin, walletInfo, isWalletConnected, isWalletConnecting, username])

    return value;
}

export default useChainAdapter;