import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { BaseCoin, ChainInfo, WalletInfo } from "@/types/types";
import { isEmpty, isNil } from "lodash";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePrice } from "./PriceProvider";
import { BaseCoinByChainName, ChainInfoByName } from "@/constants/chainConstants";
import { Wallets } from "@/constants/walletConstants";

const defaultChainName = ChainName.HEDERA;

export interface UserInfo {
    name: string;
    address: string;
    signer: any;
}

export type AppContextState = {
    userInfo: UserInfo;
    selectedChainName: ChainName;
    selectedWallet?: WalletType;
    walletInfo?: WalletInfo,
    baseCoin: BaseCoin;
    isConnected: boolean;
    isConnecting: boolean;
    basePrice: number;
    chainInfo: ChainInfo;
    selectChainName: (chainName: ChainName) => void;
    setUserInfo: (userInfo: UserInfo) => void;
    selectWallet: (wallet?: WalletType) => void;
    setIsConnecting: (isConnecting: boolean) => void;
    disconnect: () => void;
}

const AppContext = createContext<AppContextState>({
    userInfo: {
        name: '',
        address: '',
        signer: null,
    },
    selectedChainName: defaultChainName,
    selectedWallet: undefined,
    walletInfo: undefined,
    baseCoin: BaseCoinByChainName[defaultChainName],
    isConnected: false,
    isConnecting: false,
    basePrice: 0,
    chainInfo: ChainInfoByName[defaultChainName],
    selectChainName: () => { },
    setUserInfo: () => { },
    selectWallet: () => { },
    setIsConnecting: () => { },
    disconnect: () => { }
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        address: '',
        signer: null,
    });

    const [selectedChainName, setSelectedChainName] = useState<ChainName>(defaultChainName);
    const [selectedWallet, setSelectedWallet] = useState<WalletType>();

    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const { getPriceByChainName } = usePrice();

    const basePrice = useMemo(() => getPriceByChainName(selectedChainName), [selectedChainName, getPriceByChainName]);
    const baseCoin = useMemo(() => BaseCoinByChainName[selectedChainName ?? defaultChainName], [selectedChainName]);
    const chainInfo = useMemo(() => ChainInfoByName[selectedChainName ?? defaultChainName], [selectedChainName]);
    const walletInfo = useMemo(() => (Wallets.find(i => i.name === selectedWallet)), [selectedWallet])

    const isConnected = useMemo(() => !isEmpty(userInfo.address), [userInfo.address]);

    const selectChainName = useCallback((chainName: ChainName) => {
        setSelectedChainName(chainName);
        localStorage.setItem("savedChainName", chainName || '');
    }, [])

    const selectWallet = useCallback(async (wallet?: WalletType) => {
        setSelectedWallet(wallet);
        localStorage.setItem('selectedWallet', wallet || '');
    }, [])

    const disconnect = useCallback(() => {
        setUserInfo({
            name: '',
            address: '',
            signer: null,
        });
        setSelectedWallet(undefined);
        localStorage.removeItem('selectedWallet');
    }, [])

    const value = useMemo<AppContextState>(() => ({
        userInfo,
        selectedChainName,
        selectedWallet,
        walletInfo,
        baseCoin,
        isConnecting,
        basePrice,
        chainInfo,
        isConnected,
        selectChainName,
        selectWallet,
        setUserInfo,
        setIsConnecting,
        disconnect
    }), [
        userInfo,
        selectedChainName,
        selectedWallet,
        isConnected,
        isConnecting,
        basePrice,
        chainInfo,
        selectChainName,
        selectWallet,
        setIsConnecting,
        setUserInfo,
        disconnect
    ])

    useEffect(() => {
        const savedWallet = localStorage.getItem('selectedWallet');
        if (!isNil(savedWallet) && !isEmpty(savedWallet)) {
            setSelectedWallet(savedWallet as WalletType);
        }
    }, [])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);

export default AppProvider;