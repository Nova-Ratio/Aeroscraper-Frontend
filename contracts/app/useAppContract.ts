import { useWallet } from "@/contexts/WalletProvider"
import { useCallback, useMemo } from "react";
import { getAppContract } from "./contract";
import { isNil } from "lodash";
import { callBorrowerOperationsContract, callTroveManagerContract, callStabilityPoolContract, callAEROStakingContract, callSortedTrovesContract, callHintHelpersContract, callPriceFeedContract } from "./ethereumContract";
import web3 from "web3"
import { useTransaction } from "@/contexts/TransactionContext";

const useAppContract = () => {
    const wallet = useWallet();
    const { currentAccount } = useTransaction();

    const contract = useMemo(() => wallet.initialized ? getAppContract(wallet.getClient()) : undefined, [wallet]);

    const getTotalCollateralAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).contractWithSigner.getSystemColl();
        } else {
            return await contract.getTotalCollateralAmount();
        }

    }, [contract])

    const getTotalDebtAmount = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).contractWithSigner.getEntireSystemDebt();
        } else {
            return await contract.getTotalDebtAmount();
        }

    }, [contract])

    const getTrove = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).contractWithSigner.Troves(currentAccount);
        } else {
            return await contract.getTrove(user_addr);
        }
    }, [contract, currentAccount])

    const getStake = useCallback(async (user_addr: string) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callTroveManagerContract()).contractWithSigner.getTroveStake(currentAccount);
        } else {
            return await contract.getStake(user_addr);
        }
    }, [contract, currentAccount])

    // Buraya bakılacak. -- getAUSDValue --
    const getCollateralPrice = useCallback(async (_coll: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callBorrowerOperationsContract()).contractWithSigner.getAUSDValue(_coll);
        } else {
            return await contract.getCollateralPrice();
        }
    }, [contract])

    //fetchPrice
    const getTroveRatios = useCallback(async () => {
        if (isNil(contract)) return;

        const count = (await callTroveManagerContract()).contractWithSigner.troveOwnersCount();
        const ownersAddresses: [string, number][]=[]; 
        for (let i = 0; i < count; i++) {
            const address = (await callTroveManagerContract()).contractWithSigner.getTroveFromTroveOwnersArray(i);
            const coll = (await callTroveManagerContract()).contractWithSigner.troveOwnerColl(address);
            const debt = (await callTroveManagerContract()).contractWithSigner.troveOwnerDebt(address);
            const price = (await callPriceFeedContract()).contractWithSigner.lastGoodPrice();
            const collRegular = parseFloat(web3.utils.fromWei(coll.toString(), 'ether'));
            const debtRegular = parseFloat(web3.utils.fromWei(debt.toString(), 'ether'));
            const priceRegular = parseFloat(web3.utils.fromWei(price.toString(), 'ether'));
            const ratio = ((collRegular * priceRegular) / debtRegular) * 100;
            ownersAddresses[i] = [address, ratio];
        }
        return ownersAddresses;

    }, [contract])


    const openTrove = useCallback(async (amount: number, loan_amount: number) => {
        if (true) {
            const _maxFeePercentage = 5;
            const _upperHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);

            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
            console.log(amountInWei);

            // const { openTrove: openTroveMetamask } = await callBorrowerOperationsContract()
            // await openTroveMetamask(_maxFeePercentage, loan_amount, _getNext, _getPrev, {
            //     from: currentAccount,
            //     value: amountInWei
            // });

            (await callBorrowerOperationsContract()).contractWithSigner.openTrove(_maxFeePercentage, loan_amount, _upperHint, _lowerHint, {
                from: currentAccount,
                value: amountInWei
            });

        } else {
            return await contract?.openTrove(wallet.address, amount, loan_amount);
        }
        return await contract?.getTotalDebtAmount();
    }, [contract, currentAccount])


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
            const _upperHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);
    
            // Convert the amount from number (assuming it's in Ether) to Wei for the transaction
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
    
            // Send the transaction with the payable value
            (await callBorrowerOperationsContract()).contractWithSigner.addColl(_upperHint, _lowerHint, {
                from: currentAccount,
                value: amountInWei
            });
        } else {
            return await contract.addCollateral(wallet.address, amount);
        }
    }, [wallet, contract, currentAccount]);

    const removeCollateral = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _upperHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);
            (await callBorrowerOperationsContract()).contractWithSigner.withdrawColl(amount, _upperHint, _lowerHint);
        } else {
            return await contract.removeCollateral(wallet.address, amount);
        }
    }, [wallet, contract, currentAccount])

    const borrowLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _maxFeePercentage = 5;
            const _upperHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);
            (await callBorrowerOperationsContract()).contractWithSigner.withdrawAUSD(_maxFeePercentage, amount, _upperHint, _lowerHint);
        } else {
            return await contract.borrowLoan(wallet.address, amount);
        }
    }, [wallet, contract, currentAccount])

    const repayLoan = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _upperHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);
            (await callBorrowerOperationsContract()).contractWithSigner.repayAUSD(amount, _upperHint, _lowerHint);
        } else {
            return await contract.repayLoan(wallet.address, amount);
        }

    }, [wallet, contract, currentAccount])

    const stake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).contractWithSigner.stake(amount);
        } else {
            return await contract.stake(wallet.address, amount);
        }

    }, [wallet, contract])

    const unstake = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callAEROStakingContract()).contractWithSigner.unstake(amount);
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
            const _upperPartialRedemptionHint = (await callSortedTrovesContract()).contractWithSigner._getNext(currentAccount);
            const _lowerPartialRedemptionHint = (await callSortedTrovesContract()).contractWithSigner._getPrev(currentAccount);
            const _hints = (await callHintHelpersContract()).contractWithSigner.getRedemptionHints(amount, _price, _maxIterations);
            const _firstRedemptionHint = _hints.firstRedemptionHint;
            const _partialRedemptionHintNICR = _hints.partialRedemptionHintNICR;
            (await callTroveManagerContract()).contractWithSigner.redeemCollateral(amount, _firstRedemptionHint, _upperPartialRedemptionHint, _lowerPartialRedemptionHint, _partialRedemptionHintNICR, _maxIterations, _maxFeePercentage);
        } else {
            return await contract.redeem(wallet.address, amount);
        }

    }, [wallet, contract, currentAccount])

    // getTroves dan gelecek return e göre _n ayarlanacak şimdilik böyle sonra bakarsın
    const liquidateTroves = useCallback(async () => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            const _n = 3;
            (await callTroveManagerContract()).contractWithSigner.liquidateTroves(_n);
        } else {
            return await contract.liquidateTroves(wallet.address);
        }

    }, [wallet, contract])

    const withdrawLiquidationGains = useCallback(async (amount: number) => {
        if (isNil(contract)) return;
        if (wallet.walletType == "metamask") {
            (await callStabilityPoolContract()).contractWithSigner.withdrawFromSP(amount);
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
