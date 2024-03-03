import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { ChainInfo } from "@/types/types";
import { isEmpty, isNil } from "lodash";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePrice } from "./PriceProvider";
import { ChainInfoByName } from "@/constants/chainConstants";

export type AppContextState = {
    selectedChainName?: ChainName;
    selectedWallet?: WalletType;
    userAddress?: string;
    isConnecting: boolean;
    basePrice: number;
    chainInfo: ChainInfo;
    selectChainName: (chainName?: ChainName) => void;
    selectWallet: (wallet?: WalletType) => void;
}

const AppContext = createContext<AppContextState>({
    selectedChainName: ChainName.SEI,
    isConnecting: false,
    basePrice: 0,
    chainInfo: ChainInfoByName[ChainName.SEI],
    selectChainName: () => { },
    selectWallet: () => { }
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [selectedChainName, setSelectedChainName] = useState<ChainName | undefined>(ChainName.SEI);
    const [selectedWallet, setSelectedWallet] = useState<WalletType>();
    const [userAddress, setUserAddress] = useState<string>();  //This state is used to override cosmos-kit address
    const [isConnecting, setIsConnecting] = useState<boolean>(false);  //This state is used to override cosmos-kit loading

    const { getPriceByChainName } = usePrice();

    const basePrice = useMemo(() => getPriceByChainName(selectedChainName), [selectedChainName, getPriceByChainName]);
    const chainInfo = useMemo(() => ChainInfoByName[selectedChainName ?? ChainName.SEI], [selectedChainName])

    const selectChainName = useCallback((chainName?: ChainName) => {
        setSelectedChainName(chainName);
        localStorage.setItem("savedChainName", chainName || '');
    }, [])

    const selectWallet = useCallback(async (wallet?: WalletType) => {
        setSelectedWallet(wallet);
    }, [])

    const value = useMemo<AppContextState>(() => ({
        selectedChainName,
        selectedWallet,
        userAddress,
        isConnecting,
        basePrice,
        chainInfo,
        selectChainName,
        selectWallet
    }), [
        selectedChainName,
        selectedWallet,
        userAddress,
        isConnecting,
        basePrice,
        chainInfo,
        selectChainName,
        selectWallet
    ])

    // Remember last selected chain on multichain structure
    // useEffect(() => {
    //     const savedChainName = localStorage.getItem("savedChainName");
    //     if (!isNil(savedChainName) && !isEmpty(savedChainName)) {
    //         setSelectedChainName(savedChainName as ChainName);
    //     }
    // }, [])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);

export default AppProvider;