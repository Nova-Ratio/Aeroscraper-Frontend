import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { AppVersion, ChainInfo } from "@/types/types";
import { isEmpty, isNil, } from "lodash";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePrice } from "./PriceProvider";
import { ChainInfoByName } from "@/constants/chainConstants";
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";


export type AppContextState = {
  selectedAppVersion: AppVersion;
  selectedChainName?: ChainName;
  selectedWallet?: WalletType;
  userAddress?: string;
  isConnecting: boolean;
  basePrice: number;
  chainInfo: ChainInfo;
  selectChainName: (chainName?: ChainName) => void;
  selectWallet: (wallet?: WalletType) => void;
  disconnectMetamask: () => void;
  disconnectXion: () => void;
  changeAppVersion: (appVersion: AppVersion) => void;
  selectXionChain: () => void;
  openXionChainModal: () => void;
};

const AppContext = createContext<AppContextState>({
  selectedAppVersion: AppVersion.V2,
  selectedChainName: ChainName.XION,
  isConnecting: false,
  basePrice: 0,
  chainInfo: ChainInfoByName[ChainName.XION],
  selectChainName: () => { },
  selectWallet: () => { },
  disconnectMetamask: () => { },
  disconnectXion: () => { },
  changeAppVersion: () => { },
  selectXionChain: () => { },
  openXionChainModal: () => { },
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [abstraxionOpen, setAbstraxionOpen] = useModal();
  const [selectedAppVersion, setSelectedAppVersion] = useState<AppVersion>(
    AppVersion.V2
  );
  const { client: abstraxionClient, logout } = useAbstraxionSigningClient();
  const [selectedChainName, setSelectedChainName] = useState<ChainName>();
  const [selectedWallet, setSelectedWallet] = useState<WalletType>();
  const [userAddress, setUserAddress] = useState<string | undefined>(); //This state is used to override cosmos-kit address
  const [isConnecting, setIsConnecting] = useState<boolean>(false); //This state is used to override cosmos-kit loading
  const { data: abstraxionData } = useAbstraxionAccount();

  const { getPriceByChainName } = usePrice();

  const basePrice = useMemo(
    () => getPriceByChainName(selectedChainName),
    [selectedChainName, getPriceByChainName, userAddress]
  );

  const chainInfo = useMemo(
    () => ChainInfoByName[selectedChainName ?? ChainName.XION],
    [selectedChainName]
  );

  const selectChainName = useCallback((chainName?: ChainName) => {
    setSelectedChainName(chainName);
    localStorage.setItem("savedChainName", chainName || "");
  }, []);

  const selectWallet = useCallback(
    async (wallet?: WalletType) => {
      setSelectedWallet(wallet);
      localStorage.setItem("selectedWallet", wallet || "");
    },
    [selectChainName]
  );

  const disconnectMetamask = useCallback(() => {
    setUserAddress(undefined);
    setSelectedWallet(undefined);
    localStorage.removeItem("selectedWallet");
  }, []);

  const disconnectXion = useCallback(() => {
    setUserAddress(undefined);
    setAbstraxionOpen(true);
    logout && logout();
    localStorage.removeItem("selectedWallet");
    localStorage.removeItem("savedChainName");
  }, []);

  const changeAppVersion = useCallback((appVersion: AppVersion) => {
    setSelectedAppVersion(appVersion);
    localStorage.setItem("selectedAppVersion", appVersion);
  }, []);

  const openXionChainModal = useCallback(() => {
    setAbstraxionOpen(true);
  }, []);

  const selectXionChain = useCallback(() => {
    setAbstraxionOpen(false);
    setSelectedChainName(ChainName.XION);
    localStorage.setItem("savedChainName", ChainName.XION);
  }, []);

  const value = useMemo<AppContextState>(
    () => ({
      selectedAppVersion,
      selectedChainName,
      selectedWallet,
      userAddress,
      isConnecting,
      basePrice,
      chainInfo,
      selectChainName,
      selectWallet,
      disconnectMetamask,
      disconnectXion,
      changeAppVersion,
      selectXionChain,
      openXionChainModal,
    }),
    [
      selectedAppVersion,
      selectedChainName,
      selectedWallet,
      userAddress,
      isConnecting,
      basePrice,
      chainInfo,
      selectChainName,
      selectWallet,
      disconnectMetamask,
      disconnectXion,
      changeAppVersion,
      selectXionChain,
      openXionChainModal,
    ]
  );

  useEffect(() => {
    const savedChainName = localStorage.getItem("savedChainName");
    if (!isNil(savedChainName) && !isEmpty(savedChainName)) {
      setSelectedChainName(savedChainName as ChainName);

      if (savedChainName === ChainName.XION) {
        setAbstraxionOpen(true);
      }
    }

    const savedAppVersion = localStorage.getItem("selectedAppVersion");
    setSelectedAppVersion((savedAppVersion as AppVersion) ?? AppVersion.V2);
  }, []);

  useEffect(() => {
    const savedWallet = localStorage.getItem("selectedWallet");
    if (!isNil(savedWallet) && !isEmpty(savedWallet)) {
      setSelectedWallet(savedWallet as WalletType);
    }
  }, [selectXionChain]);

  useEffect(() => {
    if (selectedChainName === ChainName.XION && !isNil(abstraxionData)) {
      setUserAddress(abstraxionData?.bech32Address);
    }
  }, [selectedChainName, abstraxionData]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <Abstraxion
        onClose={() => setAbstraxionOpen(false)}
      />
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
