import { BaseCoinByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import useChainAdapter from "@/hooks/useChainAdapter";
import graphql from "@/services/graphql";
import { convertAmount } from "@/utils/contractUtils";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { isNil } from "lodash";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type PriceContextValue = {
    coinPricesByDenom: Record<string, number>;
    refreshPrices: () => void;
    getPriceByChainName: (chainName?: ChainName) => number;
}

const PriceContext = createContext<PriceContextValue>({
    coinPricesByDenom: {},
    refreshPrices: () => { },
    getPriceByChainName: () => 0
});

const PriceProvider: FC<PropsWithChildren> = ({ children }) => {
    const [coinPricesByDenom, setCoinPricesByDenom] = useState<Record<string, number>>({});
    const { address, baseCoin, getSigningCosmWasmClient } = useChainAdapter();
    const { requestNibiruPrice } = graphql({ selectedChainName: ChainName.NIBIRU, });

    const getNibiruPrice = useCallback(async () => {
        try {
            const { denom } = BaseCoinByChainName[ChainName.NIBIRU];

            const result = await requestNibiruPrice();

            const nibiruPrice = result.oracle.oraclePrices.find((i: any) => i.pair === "unibi:uusd").price

            if (result) {
                setCoinPricesByDenom(prev => ({
                    ...prev,
                    [denom]: convertAmount(nibiruPrice ?? 0, 0)
                }))
            }

        }
        catch (err) {
            console.log(err);
        }
    }, [address])
console.log(coinPricesByDenom);

    const getAllPrices = useCallback(async () => {
        getNibiruPrice();
    }, [getNibiruPrice])

    const getPriceByChainName = useCallback((chainName?: ChainName) => {
        if (isNil(chainName)) return 0;
        return coinPricesByDenom[BaseCoinByChainName[chainName].denom] ?? 0;
    }, [coinPricesByDenom])

    const contextValue = useMemo<PriceContextValue>(() => ({
        coinPricesByDenom,
        refreshPrices: getAllPrices,
        getPriceByChainName
    }), [coinPricesByDenom, getAllPrices, getPriceByChainName])

    useEffect(() => {
        getAllPrices();
    }, [getAllPrices, address]);

    return (
        <PriceContext.Provider value={contextValue}>
            {children}
        </PriceContext.Provider>
    );
}

export const usePrice = () => useContext(PriceContext);

export default PriceProvider;