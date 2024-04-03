import { BaseCoinByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import useChainAdapter from "@/hooks/useChainAdapter";
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

    const getArchwayPrice = useCallback(async () => {
        try {

            const client = await getSigningCosmWasmClient();
            const { symbol, denom } = BaseCoinByChainName[ChainName.ARCHWAY];

            const result = await client.queryContractSmart(
                String(process.env.NEXT_PUBLIC_ARCHWAY_OJO_CONTRACT_ADDRESS),
                { get_reference_data: { symbol_pair: [symbol, "USD"] } }
            );
console.log("xxx",result);

            if (result) {
                setCoinPricesByDenom(prev => ({
                    ...prev,
                    [denom]: convertAmount(Number(result.rate) ?? 0, BaseCoinByChainName.archway.decimal)
                }))
            }
        }
        catch (err) {
            console.log(err);
        }
    }, [address])

    const getAllPrices = useCallback(async () => {
        getArchwayPrice();
    }, [getArchwayPrice])

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