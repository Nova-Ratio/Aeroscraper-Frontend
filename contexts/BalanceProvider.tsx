import { ChainName } from "@/enums/Chain";
import { Dictionary } from "lodash";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppContext } from "./AppProvider";

type BalanceContextValue = {
  balanceByDenom: Dictionary<Coin | undefined>;
  refreshBalance: () => void;
};

const BalanceContext = React.createContext<BalanceContextValue>({
  balanceByDenom: {},
  refreshBalance: () => { },
});

const BalanceProvider: FC<PropsWithChildren> = ({ children }) => {
  const debounceRef = useRef<NodeJS.Timeout | undefined>();
  const { userInfo, baseCoin, selectedChainName } = useAppContext();
  const [balanceByDenom, setBalanceByDenom] = useState<
    Dictionary<Coin | undefined>
  >({});

  const getBalances = useCallback(async () => {
    try {
      if (!userInfo.address || !baseCoin) return;

      if (selectedChainName === ChainName.HEDERA) {
        // const provider = new ethers.BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        // const address = await signer.getAddress();
        // const balance = await provider.getBalance(address).then((balance: any) => {
        //   return balance;
        // });

        // setBalanceByDenom({
        //   [baseCoin.denom]: {
        //     denom: baseCoin.denom,
        //     amount: balance || "0",
        //   },
        // });
      }
    } catch (err) {
      console.log(err);
    }
  }, [userInfo, baseCoin, selectedChainName]);

  const debouncedGetBalances = useCallback(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      getBalances();
    }, 500);
  }, [getBalances]);

  const value = useMemo<BalanceContextValue>(
    () => ({
      balanceByDenom,
      refreshBalance: getBalances,
    }),
    [balanceByDenom, getBalances]
  );

  useEffect(() => {
    debouncedGetBalances();
  }, [debouncedGetBalances]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

export const useBalances = () => useContext(BalanceContext);

export default BalanceProvider;
