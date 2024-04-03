import useChainAdapter from '@/hooks/useChainAdapter';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Coin } from '@cosmjs/proto-signing';
import { Dictionary } from 'lodash';
import React, { FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type BalanceContextValue = {
    balanceByDenom: Dictionary<Coin | undefined>;
    refreshBalance: () => void;
}

const BalanceContext = React.createContext<BalanceContextValue>({
    balanceByDenom: {},
    refreshBalance: () => { }
});

const BalanceProvider: FC<PropsWithChildren> = ({ children }) => {
    const debounceRef = useRef<NodeJS.Timeout | undefined>();
    const { chain, address, baseCoin, selectedChainName,getSigningCosmWasmClient } = useChainAdapter();
    const [balanceByDenom, setBalanceByDenom] = useState<Dictionary<Coin | undefined>>({});

    const getBalances = useCallback(async () => {
    
        try {
            if (!address || !baseCoin) return;
    
            const client = await getSigningCosmWasmClient();
            const balance = await client.getBalance(address, baseCoin.denom);
       
            
            setBalanceByDenom({ [balance.denom]: balance });
        }
        catch (err) {
            console.log(123,err)
        }
    }, [chain, address, baseCoin, selectedChainName])

    const debouncedGetBalances = useCallback(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            getBalances();
        }, 500);
    }, [getBalances])

    const value = useMemo<BalanceContextValue>(() => ({
        balanceByDenom,
        refreshBalance: getBalances
    }), [balanceByDenom, getBalances])

    useEffect(() => {
        debouncedGetBalances();
    }, [debouncedGetBalances])

    useEffect(() => {
        return () => {
            clearTimeout(debounceRef.current);
        }
    }, [])

    return (
        <BalanceContext.Provider value={value}>
            {children}
        </BalanceContext.Provider>
    )
}

export const useBalances = () => useContext(BalanceContext);

export default BalanceProvider