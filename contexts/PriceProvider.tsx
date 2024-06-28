import { BaseCoinByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import { HermesClient } from "@pythnetwork/hermes-client";
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

    const getPrice = useCallback(async () => {
        try {
            const denom = BaseCoinByChainName[ChainName.HEDERA].denom;
            const connection = new HermesClient("https://hermes.pyth.network", {});

            const priceId = ["0x3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd"];

            const currentPrices = await connection.getLatestPriceUpdates(priceId);

            if (currentPrices) {
                setCoinPricesByDenom(prev => ({
                    ...prev,
                  [denom]: Number(currentPrices?.parsed?.[0]?.price?.price) / 100000000
                }))
            }
        }
        catch (err) {
            console.log(err);
        }
    }, [])

    const getAllPrices = useCallback(async () => {
        getPrice();
    }, [getPrice])

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
    }, [getAllPrices]);

    return (
        <PriceContext.Provider value={contextValue}>
            {children}
        </PriceContext.Provider>
    );
}

export const usePrice = () => useContext(PriceContext);

export default PriceProvider;