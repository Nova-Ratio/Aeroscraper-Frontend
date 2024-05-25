import { BaseCoinByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import { isNil } from "lodash";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type PriceContextValue = {
    coinPricesByDenom: Record<string, number>;
    refreshPrices: () => void;
    getPriceByChainName: (chainName?: ChainName) => number;
    getXionPrice: (price: number) => void
}

const PriceContext = createContext<PriceContextValue>({
    coinPricesByDenom: {},
    refreshPrices: () => { },
    getPriceByChainName: () => 0,
    getXionPrice: () => { }
});

const PriceProvider: FC<PropsWithChildren> = ({ children }) => {

    const [coinPricesByDenom, setCoinPricesByDenom] = useState<Record<string, number>>({});

    const getXionPrice = useCallback(async (price?: number) => {
        const denom = BaseCoinByChainName[ChainName.XION].denom;

        setCoinPricesByDenom(prev => ({
            ...prev,
            [denom]: (price ?? 0) / 100000000
        }))
    }, []);

    const getAllPrices = useCallback(async () => {
        getXionPrice();
    }, [getXionPrice])

    const getPriceByChainName = useCallback((chainName?: ChainName) => {
        if (isNil(chainName)) return 0;
        return coinPricesByDenom[BaseCoinByChainName[chainName].denom] ?? 0;
    }, [coinPricesByDenom])

    const contextValue = useMemo<PriceContextValue>(() => ({
        coinPricesByDenom,
        refreshPrices: getAllPrices,
        getPriceByChainName,
        getXionPrice
    }), [coinPricesByDenom, getAllPrices, getPriceByChainName])

    useEffect(() => {
        getAllPrices();
    }, [getAllPrices]);

    return (
        <PriceContext.Provider value={contextValue}>
            {children}
        </PriceContext.Provider>
    );
}

export const usePrice = () => useContext(PriceContext);

export default PriceProvider;