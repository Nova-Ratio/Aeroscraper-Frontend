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
import { ethers } from "ethers";


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
  const [balanceByDenom, setBalanceByDenom] = useState<Dictionary<Coin | undefined>>({});

  const getBalances = useCallback(async () => {
    try {
      if (!userInfo.address || !baseCoin) return;

      await userInfo.updateBalance?.();
      
      if (selectedChainName === ChainName.HEDERA) {
        setBalanceByDenom({
          [baseCoin.denom]: {
            denom: baseCoin.denom,
            amount: userInfo.associatedTokens?.get(baseCoin.name || 'HBAR').div(Math.pow(10, 0.1)).toString() || "0",
          },
        });
      }
    } catch (err) {
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
