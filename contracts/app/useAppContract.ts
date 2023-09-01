import { useWallet } from "@/contexts/WalletProvider"
import { useCallback, useMemo } from "react";
import { getAppContract } from "./contract";
import { isNil } from "lodash";
import { callBorrowerOperationsContract, callTroveManagerContract, callStabilityPoolContract, callAEROStakingContract, callSortedTrovesContract, callHintHelpersContract, getCommunityIssuanceContractAddress } from "./ethereumContract";
import web3 from "web3"

const useAppContract = () => {
    const wallet = useWallet();

    const contract = useMemo(() => wallet.initialized ? getAppContract(wallet.getClient()) : undefined, [wallet]);

    const getTotalCollateralAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getSystemColl;
        } else {
            return await contract.getTotalCollateralAmount();
        }

    }, [contract])

    const getTotalDebtAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getSystemDebt;
        } else {
            return await contract.getTotalDebtAmount();
        }

    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    const getTrove = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).getTroveFromTroveOwnersArray();
        } else {
            return await contract.getTrove(user_addr);
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    const getStake = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).getTroveStake(user_addr);
        } else {
            return await contract.getStake(user_addr);
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    //fetchPrice/_getUSDValue ** pricefeed/borroweroperations
    const getCollateralPrice = useCallback(async (_coll: number, _price: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).getCollateralPrice(_coll, _price);
        } else {
            return await contract.getCollateralPrice();
        }
    }, [contract])

    //Parametreler ana fonksiyona eklenecek
    //_upperHint, _lowerHint kontrat tarafından çekilecek değerler.
    const openTrove = useCallback(async (amount: number, loan_amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _maxFeePercentage = 5;
            const _upperHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerHint = (await callSortedTrovesContract())._getPrev(wallet.address);

            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

            (await callBorrowerOperationsContract()).openTrove(_maxFeePercentage, loan_amount, _upperHint, _lowerHint, {
                from: wallet.address,
                value: amountInWei
            });

        } else {
            return await contract.openTrove(wallet.address, amount, loan_amount);
        }
        return await contract.getTotalDebtAmount();
    }, [contract])


    const getTroveByAddress = useCallback(async (address: string) => {
        if (isNil(contract)) return;
        return await contract.getTrove(address);
    }, [contract])

    const getTotalStake = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getTotalStake();
    }, [contract])

    const getAusdBalance = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getAusdBalance(wallet.address);
    }, [wallet, contract])

    const getAusdInfo = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getAusdInfo();
    }, [contract])

    const getReward = useCallback(async () => {
        if (isNil(contract)) return;
        return await contract.getReward(wallet.address);
    }, [wallet, contract])

    const addCollateral = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
    
        if (wallet.walletType === "metamask") {
            const _upperHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerHint = (await callSortedTrovesContract())._getPrev(wallet.address);
    
            // Convert the amount from number (assuming it's in Ether) to Wei for the transaction
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
    
            // Send the transaction with the payable value
            (await callBorrowerOperationsContract()).addColl(_upperHint, _lowerHint, {
                from: wallet.address,
                value: amountInWei
            });
        } else {
            return await contract.addCollateral(wallet.address, amount);
        }
    }, [wallet, contract]);

    //Parametreler ana fonksiyona eklenecek
    const removeCollateral = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _upperHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerHint = (await callSortedTrovesContract())._getPrev(wallet.address);
            (await callBorrowerOperationsContract()).withdrawColl(amount, _upperHint, _lowerHint);
        } else {
            return await contract.removeCollateral(wallet.address, amount);
        }
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const borrowLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _maxFeePercentage = 5;
            const _upperHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerHint = (await callSortedTrovesContract())._getPrev(wallet.address);
            (await callBorrowerOperationsContract()).withdrawAUSD(_maxFeePercentage, amount, _upperHint, _lowerHint);
        } else {
            return await contract.borrowLoan(wallet.address, amount);
        }
    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const repayLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _upperHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerHint = (await callSortedTrovesContract())._getPrev(wallet.address);
            (await callBorrowerOperationsContract()).repayAUSD(amount, _upperHint, _lowerHint);
        } else {
            return await contract.repayLoan(wallet.address, amount);
        }

    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const stake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).stake(amount);
        } else {
            return await contract.stake(wallet.address, amount);
        }

    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const unstake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).unstake(amount);
        } else {
            return await contract.unstake(wallet.address, amount);
        }
    }, [wallet, contract])

    const redeem = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _maxFeePercentage = 5;
            const _maxIterations = 0;
            const _price = 1;
            const _upperPartialRedemptionHint = (await callSortedTrovesContract())._getNext(wallet.address);
            const _lowerPartialRedemptionHint = (await callSortedTrovesContract())._getPrev(wallet.address);
            const _hints = (await callHintHelpersContract())._getRedemptionHints(amount, _price, _maxIterations);
            const _firstRedemptionHint = _hints.firstRedemptionHint;
            const _partialRedemptionHintNICR = _hints.partialRedemptionHintNICR;
            (await callTroveManagerContract()).redeemCollateral(amount, _firstRedemptionHint, _upperPartialRedemptionHint, _lowerPartialRedemptionHint, _partialRedemptionHintNICR, _maxIterations, _maxFeePercentage);
        } else {
            return await contract.redeem(wallet.address, amount);
        }

    }, [wallet, contract])

    const liquidateTroves = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _n = 3;
            (await callTroveManagerContract()).liquidateTroves(_n);
        } else {
            return await contract.liquidateTroves(wallet.address);
        }

    }, [wallet, contract])

    //Parametreler ana fonksiyona eklenecek
    const withdrawLiquidationGains = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _communityIssuanceAddress = (await getCommunityIssuanceContractAddress())._address;
            const _hardCodedFrontEndAddress = "0x8fBB8C2CaA543d7eA1A7e47f6ACa27038646FA2B";
            (await callStabilityPoolContract())._payOutAEROGains(_communityIssuanceAddress, wallet.address, _hardCodedFrontEndAddress);
        } else {
            return await contract.withdrawLiquidationGains(wallet.address);
        }
        callStabilityPoolContract
    }, [wallet, contract])

    const value = useMemo(() => ({
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getTroveByAddress,
        getTotalStake,
        getCollateralPrice,
        getAusdBalance,
        getAusdInfo,
        getReward,
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
        getTroveByAddress,
        getTotalStake,
        getCollateralPrice,
        getAusdBalance,
        getAusdInfo,
        getReward,
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
