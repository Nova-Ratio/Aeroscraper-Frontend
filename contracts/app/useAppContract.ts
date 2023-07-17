import { useWallet } from "@/contexts/WalletProvider"
import { useCallback, useMemo } from "react";
import { getAppContract } from "./contract";
import { isNil } from "lodash";

const useAppContract = () => {
    const wallet = useWallet();

    const contract = useMemo(() => wallet.initialized ? getAppContract(wallet.getClient()) : undefined, [wallet]);

    const getTotalCollateralAmount = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getTotalCollateralAmount();
    }, [contract])

    const getTotalDebtAmount = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getTotalDebtAmount();
    }, [contract])

    const getTrove = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        return await contract.getTrove(user_addr);
    }, [contract])

    const getStake = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        return await contract.getStake(user_addr);
    }, [contract])

    const getCollateralPrice = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getCollateralPrice();
    }, [contract])

    const value = useMemo(() => ({
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getCollateralPrice
    }), [
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getCollateralPrice
    ])

    return value;
}

export default useAppContract