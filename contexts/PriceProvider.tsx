import { BaseCoinByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import { callFetchPrice } from "@/evmContractInteractions/useAppContracts";
import { convertAmount, getRequestAmount } from "@/utils/contractUtils";
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

    const getInjPrice = useCallback(async () => {
        try {
            const denom = BaseCoinByChainName[ChainName.INJECTIVE].denom;
            const connection = new PriceServiceConnection(
                "https://hermes-beta.pyth.network/",
                {
                    priceFeedRequestConfig: {
                        binary: true,
                    },
                }
            )

            const priceId = ["2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3"];

            const currentPrices = await connection.getLatestPriceFeeds(priceId);

            if (currentPrices) {
                setCoinPricesByDenom(prev => ({
                    ...prev,
                    [denom]: Number(currentPrices[0].getPriceUnchecked().price) / 100000000
                }))
            }
        }
        catch (err) {
            console.log(err);
        }
    }, []);
    
    const getEthPrice = useCallback(async () => {
        try {
           
            const denom = BaseCoinByChainName[ChainName.EVM].denom;
            const connection = new PriceServiceConnection(
                "https://hermes.pyth.network/",
                {
                    priceFeedRequestConfig: {
                        binary: true,
                    },
                }
            )

            const priceId = ["0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"];

            const currentPrices = await connection.getLatestPriceFeeds(priceId);

            if (currentPrices) {
                setCoinPricesByDenom(prev => ({
                    ...prev,
                    [denom]: Number(currentPrices[0].getPriceUnchecked().price) / 100000000
                }))
            }
        }
        catch (err) {
            console.log(err);
        }
    }, [])

    const getAllPrices = useCallback(async () => {
        getInjPrice();
        getEthPrice();
    }, [getInjPrice])

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