import {
    callBorrowerOperationsContract,
    callTroveManagerContract,
    callSortedTrovesContract,
    callAUSDTTokenContract,
    callPriceFeedContract,
    callAUSDStakingContract,
} from "./ethereumContracts";
import { ethers, BigNumberish } from "ethers";

//StabilityPool Contract
export const callGetNICR = async (address: string, _maxAUSDamount: string | number | bigint, _price: string) => {
    try {
        const getNICR = await (await callTroveManagerContract()).contractWithSigner.getNICR(address, _maxAUSDamount, _price);
        return await getNICR;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//borrowerOperations Contract Functions
export const callOpenTrove = async (
    _borrower: string,
    _AUSDAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string,
    _value: ethers.BigNumberish
) => {
    try {
        const openTrove = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.openTrove(
            _AUSDAmount,
            _upperHint,
            _lowerHint,
            { value: _value }
        );
        return await openTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callAddColl = async (_upperHint: string, _lowerHint: string) => {
    try {
        const addColl = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.addColl(_upperHint, _lowerHint);
        return await addColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callEntireSystemColl = async () => {
    try {
        const entireSystemColl = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.entireSystemColl();
        return await entireSystemColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callEntireSystemDebt = async () => {
    try {
        const entireSystemDebt = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.entireSystemDebt();
        return await entireSystemDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetAUSDValue = async (_coll: number) => {
    try {
        const getAUSDValue = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.getAUSDValue(_coll);
        return await getAUSDValue;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callCloseTrove = async () => {
    try {
        const closeTrove = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.closeTrove();
        return await closeTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callRepayAUSD = async (
    _AUSDAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string
) => {
    try {
        const repayAUSD = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.repayAUSD(_AUSDAmount, _upperHint, _lowerHint);
        return await repayAUSD;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callMoveETHGainToTrove = async (
    _borrower: string,
    _upperHint: string,
    _lowerHint: string
) => {
    try {
        const moveETHGainToTrove = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.moveETHGainToTrove(_borrower, _upperHint, _lowerHint);
        return await moveETHGainToTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callWithdrawColl = async (
    _collWithdrawal: BigNumberish,
    _upperHint: string,
    _lowerHint: string
) => {
    try {
        const withdrawColl = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.withdrawColl(_collWithdrawal, _upperHint, _lowerHint);
        return await withdrawColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callWithdrawAUSD = async (
    _AUSDAmount: BigNumberish,
    _upperHint: string,
    _lowerHint: string
) => {
    try {
        const withdrawAUSD = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.withdrawAUSD(
            _AUSDAmount,
            _upperHint,
            _lowerHint
        );
        return await withdrawAUSD;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callAdjustTrove = async (
    _collWithdrawal: number,
    _AUSDChange: boolean,
    _isDebtIncrease: boolean,
    _upperHint: string,
    _lowerHint: string
) => {
    try {
        const adjustTrove = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.adjustTrove(
            _collWithdrawal,
            _AUSDChange,
            _isDebtIncrease,
            _upperHint,
            _lowerHint
        );
        return await adjustTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callBorrowerOperationsSetAddresses = async (
    _troveManagerAddress: string,
    _activePoolAddress: string,
    _defaultPoolAddress: string,
    _stabilityPoolAddress: string,
    _collSurplusPoolAddress: string,
    _priceFeedAddress: string,
    _sortedTrovesAddress: string,
    _AUSDTokenAddress: string,
    _feeTaker: string
) => {
    try {
        const setAddresses = await (
            await callBorrowerOperationsContract()
        ).contractWithSigner.setAddresses(
            _troveManagerAddress,
            _activePoolAddress,
            _defaultPoolAddress,
            _stabilityPoolAddress,
            _collSurplusPoolAddress,
            _priceFeedAddress,
            _sortedTrovesAddress,
            _AUSDTokenAddress,
            _feeTaker
        );
        return await setAddresses;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// TroveManager Contract

export const callBatchLiquidateTroves = async (_troveArray: string[]) => {
    try {
        const batchLiquidateTroves = await (
            await callTroveManagerContract()
        ).contractWithSigner.batchLiquidateTroves(_troveArray);
        return await batchLiquidateTroves;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetNominalICR = async (_borrower: string) => {
    try {
        const getNominalICR = await (
            await callTroveManagerContract()
        ).contractWithSigner.getNominalICR(_borrower);
        return await getNominalICR;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetCurrentICR = async (_borrower: string, _price: number) => {
    try {
        const getCurrentICR = await (
            await callTroveManagerContract()
        ).contractWithSigner.getCurrentICR(_borrower, _price);
        return await getCurrentICR;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetPendingETHReward = async (_borrower: string) => {
    try {
        const getPendingETHReward = await (
            await callTroveManagerContract()
        ).contractWithSigner.getPendingETHReward(_borrower);
        return await getPendingETHReward;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetPendingAUSDDebtReward = async (_borrower: string) => {
    try {
        const getPendingAUSDDebtReward = await (
            await callTroveManagerContract()
        ).contractWithSigner.getPendingAUSDDebtReward(_borrower);
        return await getPendingAUSDDebtReward;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callHasPendingRewards = async (_borrower: string) => {
    try {
        const hasPendingRewards = await (
            await callTroveManagerContract()
        ).contractWithSigner.hasPendingRewards(_borrower);
        return await hasPendingRewards;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetEntireDebtAndColl = async (_borrower: string) => {
    try {
        const getEntireDebtAndColl = await (
            await callTroveManagerContract()
        ).contractWithSigner.getEntireDebtAndColl(_borrower);
        return await getEntireDebtAndColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetRedemptionRate = async () => {
    try {
        const getRedemptionRate = await (
            await callTroveManagerContract()
        ).contractWithSigner.getRedemptionRate();
        return await getRedemptionRate;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingRate = async () => {
    try {
        const getBorrowingRate = await (
            await callTroveManagerContract()
        ).contractWithSigner.getBorrowingRate();
        return await getBorrowingRate;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingRateWithDecay = async () => {
    try {
        const getBorrowingRateWithDecay = await (
            await callTroveManagerContract()
        ).contractWithSigner.getBorrowingRateWithDecay();
        return await getBorrowingRateWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callTroveManagerSetAddresses = async (
    _borrowerOperationsAddress: string,
    _activePoolAddress: string,
    _defaultPoolAddress: string,
    _stabilityPoolAddress: string,
    _collSurplusPoolAddress: string,
    _priceFeedAddress: string,
    _AUSDTokenAddress: string,
    _sortedTrovesAddress: string
) => {
    try {
        const setAddresses = await (
            await callTroveManagerContract()
        ).contractWithSigner.setAddresses(
            _borrowerOperationsAddress,
            _activePoolAddress,
            _defaultPoolAddress,
            _stabilityPoolAddress,
            _collSurplusPoolAddress,
            _priceFeedAddress,
            _AUSDTokenAddress,
            _sortedTrovesAddress
        );
        return await setAddresses;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveOwnersCount = async () => {
    try {
        const getTroveOwnersCount = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveOwnersCount();
        return await getTroveOwnersCount;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveFromTroveOwnersArray = async (_index: number) => {
    try {
        const getTroveFromTroveOwnersArray = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveFromTroveOwnersArray(_index);
        return await getTroveFromTroveOwnersArray;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callLiquidate = async (borrower: string) => {
    try {
        const liquidate = await (
            await callTroveManagerContract()
        ).contractWithSigner.liquidate(borrower);
        await liquidate.wait();
        return liquidate;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callLiquidateTroves = async (n: number) => {
    try {
        const liquidateTroves = await (
            await callTroveManagerContract()
        ).contractWithSigner.liquidateTroves(n);
        return await liquidateTroves;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callRedeemCollateral = async (
    _AUSDamount: ethers.BigNumberish, // Amount to redeem
    _maxIterations: number,  // Maximum number of iterations
) => {
    try {
        // Fetch current price for NICR calculation
        const price = await callFetchPrice();

        // Fetch all trove owners and NICR values
        const allTroveData = await fetchAllTroveOwnersAndNICR();

        if (!allTroveData || allTroveData.length === 0) {
            throw new Error("No trove data available.");
        }

        // Find the appropriate hints (prev and next) based on the NICR
        const firstRedemptionHint = allTroveData[0].owner; // Assume first trove as starting point
        const upperPartialRedemptionHint = allTroveData[allTroveData.length - 1].owner; // Assume last trove as ending point

        // Calculate partial redemption hints by iterating through the troves
        let lowerPartialRedemptionHint = ethers.ZeroAddress;
        let partialRedemptionHintNICR = 0;

        for (let i = 0; i < allTroveData.length; i++) {
            const { owner, NICR } = allTroveData[i];

            // Use NICR to find the lowerPartialRedemptionHint and partialRedemptionHintNICR
            if (NICR < partialRedemptionHintNICR || partialRedemptionHintNICR === 0) {
                lowerPartialRedemptionHint = owner;
                partialRedemptionHintNICR = NICR;
            }
        }

        // Ensure hints are correctly defined
        if (!firstRedemptionHint || !upperPartialRedemptionHint || !lowerPartialRedemptionHint) {
            throw new Error("Unable to determine redemption hints.");
        }

        // Call the TroveManager contract's redeemCollateral function with calculated hints
        const troveManagerContract = await callTroveManagerContract();
        const redeemCollateral = await troveManagerContract.contractWithSigner.redeemCollateral(
            _AUSDamount,
            firstRedemptionHint,  // _firstRedemptionHint
            upperPartialRedemptionHint,  // _upperPartialRedemptionHint
            lowerPartialRedemptionHint,  // _lowerPartialRedemptionHint
            partialRedemptionHintNICR,  // _partialRedemptionHintNICR
            _maxIterations  // _maxIterations
        );

        // Wait for transaction to be mined
        const receipt = await redeemCollateral.wait();

        // Return receipt or confirmation
        return receipt;
    } catch (error) {
        console.log("Error in callRedeemCollateral:", error);
        return false;
    }
};

export const callApplyPendingRewards = async (borrower: string) => {
    try {
        const applyPendingRewards = await (
            await callTroveManagerContract()
        ).contractWithSigner.applyPendingRewards(borrower);
        return await applyPendingRewards;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callUpdateTroveRewardSnapshots = async (borrower: string) => {
    try {
        const updateTroveRewardSnapshots = await (
            await callTroveManagerContract()
        ).contractWithSigner.updateTroveRewardSnapshots(borrower);
        return await updateTroveRewardSnapshots;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callRemoveStake = async (borrower: string) => {
    try {
        const removeStake = await (
            await callTroveManagerContract()
        ).contractWithSigner.removeStake(borrower);
        return await removeStake;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callUpdateStakeAndTotalStakes = async (borrower: string) => {
    try {
        const updateStakeAndTotalStakes = await (
            await callTroveManagerContract()
        ).contractWithSigner.updateStakeAndTotalStakes(borrower);
        return await updateStakeAndTotalStakes;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callCloseTroveTroveManager = async (borrower: string) => {
    try {
        const closeTrove = await (
            await callTroveManagerContract()
        ).contractWithSigner.closeTrove(borrower);
        return await closeTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callAddTroveOwnerToArray = async (borrower: string) => {
    try {
        const addTroveOwnerToArray = await (
            await callTroveManagerContract()
        ).contractWithSigner.addTroveOwnerToArray(borrower);
        return await addTroveOwnerToArray;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTCR = async (price: number) => {
    try {
        const getTCR = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTCR(price);
        return await getTCR;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetRedemptionFeeWithDecay = async (_ETHDrawn: number) => {
    try {
        const getRedemptionFeeWithDecay = await (
            await callTroveManagerContract()
        ).contractWithSigner.getRedemptionFeeWithDecay(_ETHDrawn);
        return await getRedemptionFeeWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingFee = async (_AUSDDebt: number) => {
    try {
        const getBorrowingFee = await (
            await callTroveManagerContract()
        ).contractWithSigner.getBorrowingFee(_AUSDDebt);
        return await getBorrowingFee;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingFeeWithDecay = async (_AUSDDebt: number) => {
    try {
        const getBorrowingFeeWithDecay = await (
            await callTroveManagerContract()
        ).contractWithSigner.getBorrowingFeeWithDecay(_AUSDDebt);
        return await getBorrowingFeeWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callDecayBaseRateFromBorrowing = async () => {
    try {
        const decayBaseRateFromBorrowing = await (
            await callTroveManagerContract()
        ).contractWithSigner.decayBaseRateFromBorrowing();
        return await decayBaseRateFromBorrowing;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveStatus = async (borrower: string) => {
    try {
        const getTroveStatus = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveStatus(borrower);
        return await getTroveStatus;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveStake = async (borrower: string) => {
    try {
        const getTroveStake = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveStake(borrower);
        return await getTroveStake;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveDebt = async (borrower: string) => {
    try {
        const getTroveDebt = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveDebt(borrower);
        return await getTroveDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveColl = async (borrower: string) => {
    try {
        const getTroveColl = await (
            await callTroveManagerContract()
        ).contractWithSigner.getTroveColl(borrower);
        return await getTroveColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callSetTroveStatus = async (borrower: string, num: number) => {
    try {
        const setTroveStatus = await (
            await callTroveManagerContract()
        ).contractWithSigner.setTroveStatus(borrower, num);
        return await setTroveStatus;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callIncreaseTroveColl = async (
    borrower: string,
    _collIncrease: number
) => {
    try {
        const increaseTroveColl = await (
            await callTroveManagerContract()
        ).contractWithSigner.increaseTroveColl(borrower, _collIncrease);
        return await increaseTroveColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callDecreaseTroveColl = async (
    borrower: string,
    _collDecrease: number
) => {
    try {
        const decreaseTroveColl = await (
            await callTroveManagerContract()
        ).contractWithSigner.decreaseTroveColl(borrower, _collDecrease);
        return await decreaseTroveColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callIncreaseTroveDebt = async (
    borrower: string,
    _debtIncrease: number
) => {
    try {
        const increaseTroveDebt = await (
            await callTroveManagerContract()
        ).contractWithSigner.increaseTroveDebt(borrower, _debtIncrease);
        return await increaseTroveDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callDecreaseTroveDebt = async (
    borrower: string,
    _debtDecrease: number
) => {
    try {
        const decreaseTroveDebt = await (
            await callTroveManagerContract()
        ).contractWithSigner.decreaseTroveDebt(borrower, _debtDecrease);
        return await decreaseTroveDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callTroves = async (borrower: string) => {
    try {
        const troves = await (
            await callTroveManagerContract()
        ).contractWithSigner.Troves(borrower);
        return await troves;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Sorted Troves Functions
export const callFindInsertPositon = async (
    _NICR: number,
    _prevId: string,
    _nextId: string
) => {
    try {
        const findInsertPosition = await (
            await callSortedTrovesContract()
        ).contractWithSigner.findInsertPosition(_NICR, _prevId, _nextId);
        return await findInsertPosition;
    } catch (error) {
        console.log(error);
        return false;
    }
};
//ASUD Token Contract Functions
export const callBalanceOf = async (borrower: string) => {
    try {
        const balanceOf = await (
            await callAUSDTTokenContract()
        ).contractWithSigner.balanceOf(borrower);
        return await balanceOf;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callAllowance = async (owner: string, spender: string) => {
    try {
        const allowance = await (
            await callAUSDTTokenContract()
        ).contractWithSigner.allowance(owner, spender);
        return await allowance;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callApprove = async (spender: string, amount: number) => {
    try {
        const approve = await (
            await callAUSDTTokenContract()
        ).contractWithSigner.approve(spender, amount);
        return await approve;
    } catch (error) {
        console.log(error);
        return false;
    }
};
//PriceFeed Contract Functions
export const callFetchPrice = async () => {
    try {
        const fetchPrice = await (
            await callPriceFeedContract()
        ).contractWithSigner.fetchPrice();
        return await fetchPrice;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//AUSDStaking Contract Functions
export const callStake = async (address: string, _amount: number) => {
    try {
        let spender = (await callAUSDStakingContract()).Address;
        let owner = address;

        let checker = await (await callAUSDTTokenContract()).contractWithSigner.allowance(owner, spender);
        if (checker < _amount) {
            await (await callAUSDTTokenContract()).contractWithSigner.approve(spender, _amount);
        }
        const stake = await (
            await callAUSDStakingContract()
        ).contractWithSigner.stake(_amount);
        return await stake;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callUnstake = async (_amount: number) => {
    try {
        const unstake = await (
            await callAUSDStakingContract()
        ).contractWithSigner.unstake(_amount);
        return await unstake;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetStake = async (_staker: string) => {
    try {
        const getStake = await (
            await callAUSDStakingContract()
        ).contractWithSigner.getStake(_staker);
        return await getStake;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTotalAUSDStaked = async () => {
    try {
        const getTotalAUSDStaked = await (
            await callAUSDStakingContract()
        ).contractWithSigner.getTotalAUSDStaked();
        return await getTotalAUSDStaked;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callStakeShare = async (staker: string) => {
    try {
        const getStake = await (
            await callAUSDStakingContract()
        ).contractWithSigner.getStake(staker);
        const totalStaked = await (
            await callAUSDStakingContract()
        ).contractWithSigner.getTotalAUSDStaked();
        console.log(getStake, totalStaked);

        const stakeShare = Number(getStake) / Number(totalStaked);
        console.log(stakeShare, Number(stakeShare) * 100, getStake, totalStaked);

        return Number(stakeShare) * 100;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const callClaimReward = async () => {
    try {
        const claimReward = await (
            await callAUSDStakingContract()
        ).contractWithSigner.claimReward();
        await claimReward.wait();
        return await claimReward;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//AUSDToken Contract Functions
export const callCirculatedTotalSupply = async () => {
    try {
        const circulatedTotalSupply = await (
            await callAUSDTTokenContract()
        ).contractWithSigner.totalSupply();
        return await circulatedTotalSupply;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

//New addendums for coping with indexer needs
// Helper function to calculate NICR
const calculateNICR = (collateral: ethers.BigNumberish, debt: ethers.BigNumberish): number => {
    return Number(BigInt(collateral.toString()) * BigInt(1e18) / BigInt(debt.toString()));
};

// Fetch all trove owners and their NICR values in an array
export const fetchAllTroveOwnersAndNICR = async (): Promise<{
    owner: string;
    NICR: number;
}[]> => {
    try {
        const troveOwnersCount = await callGetTroveOwnersCount(); // Get the number of trove owners
        const troveDataArray: { owner: string; NICR: number }[] = [];

        // Loop through all trove owners and get their NICR
        for (let i = 0; i < troveOwnersCount; i++) {
            const owner = await callGetTroveFromTroveOwnersArray(i);
            const debt = await callGetTroveDebt(owner);
            const collateral = await callGetTroveColl(owner);

            if (BigInt(debt.toString()) === BigInt(0)) {
                continue; // Skip troves with zero debt
            }

            // Calculate the NICR for each trove
            const NICR = calculateNICR(collateral, debt);

            // Push the owner address and their NICR to the array
            troveDataArray.push({
                owner,
                NICR
            });
        }

        return troveDataArray;
    } catch (error) {
        console.log("Error fetching trove owners and NICR values:", error);
        return [];
    }
};

// Function to calculate new prev and next nodes and NICR after opening or modifying a trove
export const calculateNewPositionAndNICR = async (
    borrower: string,
    AUSDChange: ethers.BigNumberish,  // AUSD debt change
    collateralChange: ethers.BigNumberish,  // Collateral change
    isNewTrove: boolean, // Flag indicating if the trove is new
    isDebtIncrease: boolean,  // Flag indicating if the debt is increasing or decreasing
    isCollIncrease: boolean  // Flag indicating if the collateral is increasing or decreasing
): Promise<{
    prev: string;
    next: string;
    NICR: number;
} | null> => {
    try {
        let newDebt: ethers.BigNumberish;
        let newCollateral: ethers.BigNumberish;

        if (!isNewTrove) {
            // Fetch the current debt and collateral for the borrower
            const currentDebt = await callGetTroveDebt(borrower);
            const currentCollateral = await callGetTroveColl(borrower);

            // Calculate the new debt based on whether it's increasing or decreasing
            newDebt = isDebtIncrease
                ? ethers.parseUnits(currentDebt.toString(), 0) + (ethers.parseUnits(AUSDChange.toString(), 0))  // Increase the debt
                : ethers.parseUnits(currentDebt.toString(), 0) - (ethers.parseUnits(AUSDChange.toString(), 0)); // Decrease the debt

            // Calculate the new collateral after the change
            newCollateral = isCollIncrease
                ? ethers.parseUnits(currentCollateral.toString(), 0) + (ethers.parseUnits(collateralChange.toString(), 0))  // Increase the collateral
                : ethers.parseUnits(currentCollateral.toString(), 0) - (ethers.parseUnits(collateralChange.toString(), 0)); // Decrease the collateral
        } else {
            // For new troves, use the provided values directly
            newDebt = ethers.parseUnits(AUSDChange.toString(), 0);
            newCollateral = ethers.parseUnits(collateralChange.toString(), 0);
        }

        // Check if the debt has become zero or negative after the operation
        if (newDebt === BigInt(0) || newDebt < BigInt(0)) {
            console.log("Error: Debt cannot be zero or negative.");
            return null;
        }

        // Calculate the new NICR (collateral / debt)
        const newNICR = calculateNICR(newCollateral, newDebt);

        // Fetch all trove owners and their NICRs
        const allTroveData = await fetchAllTroveOwnersAndNICR();

        // Find the appropriate prev and next nodes by comparing the new NICR
        let prevNode = ethers.ZeroAddress;
        let nextNode = ethers.ZeroAddress;

        for (let i = 0; i < allTroveData.length; i++) {
            const { owner, NICR } = allTroveData[i];

            // If the new NICR is smaller, we insert before this trove
            if (newNICR < NICR) {
                nextNode = owner;
                if (i > 0) {
                    prevNode = allTroveData[i - 1].owner;
                }
                break;
            }
        }

        // If no nextNode is found, set the prevNode to the last owner
        if (nextNode === ethers.ZeroAddress && allTroveData.length > 0) {
            prevNode = allTroveData[allTroveData.length - 1].owner;
        }

        // Return the prev, next nodes, and the new NICR
        return {
            prev: prevNode,
            next: nextNode,
            NICR: newNICR
        };
    } catch (error) {
        console.log("Error calculating new position and NICR:", error);
        return null;
    }
};