import { ChainName } from "@/enums/Chain";
import useChainAdapter from "@/hooks/useChainAdapter";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/proto-signing";
import { ethers } from "ethers";
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

type BalanceContextValue = {
  balanceByDenom: Dictionary<Coin | undefined>;
  refreshBalance: () => void;
};

const BalanceContext = React.createContext<BalanceContextValue>({
  balanceByDenom: {},
  refreshBalance: () => {},
});

const BalanceProvider: FC<PropsWithChildren> = ({ children }) => {
  const debounceRef = useRef<NodeJS.Timeout | undefined>();
  const { chain, address, baseCoin, selectedChainName } = useChainAdapter();
  const [balanceByDenom, setBalanceByDenom] = useState<
    Dictionary<Coin | undefined>
  >({});

  const getBalances = useCallback(async () => {
    try {
      if (!address || !baseCoin) return;

      /*  const client = await SigningCosmWasmClient.connect("https://sentry.tm.injective.network" ?? '')
            const balance = await client.getBalance(address, baseCoin.denom);
            setBalanceByDenom({ [balance.denom]: balance }); */

      // metamask native token get balance
      if (selectedChainName === ChainName.AVAX) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address).then((balance: any) => {
          //console.log("getBalance", ethers.formatEther(balance));
          return balance;
        });
        //console.log("baseCoin.denom", baseCoin.denom);
        //console.log("balance", balance);
        
        setBalanceByDenom({
          [baseCoin.denom]: {
            denom: baseCoin.denom,
            amount: balance || "0",
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [chain, address, baseCoin, selectedChainName]);

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
