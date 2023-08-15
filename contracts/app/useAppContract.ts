import { useWallet } from "@/contexts/WalletProvider"
import { useCallback, useMemo } from "react";
import { getAppContract } from "./contract";
import { isNil } from "lodash";
import { callBorrowerOperationsContract, callTroveManagerContract, callStabilityPoolContract, callAEROStakingContract } from "./ethereumContract";

const useAppContract = () => {
    const wallet = useWallet();

    const contract = useMemo(() => wallet.initialized ? getAppContract(wallet.getClient()) : undefined, [wallet]);

    const getTotalCollateralAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getSystemColl;
        }else{
            return await contract.getTotalCollateralAmount();
        }
        
    }, [contract])

    const getTotalDebtAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getSystemDebt;
        }else{
            return await contract.getTotalDebtAmount();
        }
        
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    const getTrove = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).getTroveFromTroveOwnersArray();
        }else{
            return await contract.getTrove(user_addr);
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    const getStake = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).getTroveStake(user_addr);
        }else{
            return await contract.getStake(user_addr);
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    //fetchPrice/_getUSDValue ** pricefeed/borroweroperations
    const getCollateralPrice = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getCollateralPrice(_coll, _price);
        }else{
            return await contract.getCollateralPrice();
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    const openTrove = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).openTrove(_maxFeePercentage, _AUSDAmount, _upperHint, _lowerHint);
        }else{
            return await contract.openTrove(wallet.address, amount);
        }
        
        
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const addCollateral = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).addColl(_upperHint, _lowerHint);
        }else{
            return await contract.addCollateral(wallet.address, amount);
        }
        
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const removeCollateral = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).withdrawColl(_collWithdrawal, _upperHint, _lowerHint);
        }else{
            return await contract.removeCollateral(wallet.address, amount);
        }
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const borrowLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).withdrawAUSD(_maxFeePercentage, _AUSDAmount, _upperHint, _lowerHint);
        }else{
            return await contract.borrowLoan(wallet.address, amount);
        }
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const repayLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).repayAUSD(_AUSDAmount, _upperHint, _lowerHint);
        }else{
            return await contract.repayLoan(wallet.address, amount);
        }
        
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const stake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).stake(_AEROamount);
        }else{
            return await contract.stake(wallet.address, amount);
        }
        
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const unstake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).unstake(_AEROamount);
        }else{
            return await contract.unstake(wallet.address, amount);
        }
    }, [wallet, contract])

    const redeem = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).redeemCollateral();
        }else{
            return await contract.redeem(wallet.address, amount);
        }
        
    }, [wallet, contract])

    const liquidateTroves = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).liquidateTroves();
        }else{
            return await contract.liquidateTroves(wallet.address);
        }
        
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const withdrawLiquidationGains = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callStabilityPoolContract())._payOutAEROGains(_communityIssuance, _depositor, _frontEnd);
        }else{
            return await contract.withdrawLiquidationGains(wallet.address);
        }
        callStabilityPoolContract
    }, [wallet, contract])

    const value = useMemo(() => ({
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getCollateralPrice,
        openTrove,
        addCollateral,
        removeCollateral,
        borrowLoan,
        repayLoan,
        stake,
        unstake,
        redeem,
        liquidateTroves,
        withdrawLiquidationGains
    }), [
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getCollateralPrice,
        openTrove,
        addCollateral,
        removeCollateral,
        borrowLoan,
        repayLoan,
        stake,
        unstake,
        redeem,
        liquidateTroves,
        withdrawLiquidationGains
    ])

    return value;
}

export default useAppContract