
import { ethers } from "ethers";
import { callBorrowerOperationsContract, callTroveManagerContract, callStabilityPoolContract, callSortedTrovesContract, callAUSDTTokenContract,callPriceFeedContract } from "./ethereumContracts";
import { useMemo } from 'react';

//StabilityPool Contract
export const callStabilityPoolSetAddresses = async (_borrowerOperationsAddress: string, _troveManagerAddress: string, _activePoolAddress: string, _AUSDTokenAddress: string, _sortedTrovesAddress: string, _priceFeedAddress: string) => {
    try {
        const setAddresses = await (await callStabilityPoolContract()).contractWithSigner.setAddresses();
        return await setAddresses;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getETH = async () => {
    try {
        const getETH = await (await callStabilityPoolContract()).contractWithSigner.getETH();
        return await getETH;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getTotalAUSDDeposits = async () => {
    try {
        const totalAUSDDeposits = await (await callStabilityPoolContract()).contractWithSigner.getTotalAUSDDeposits();
        return await totalAUSDDeposits;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const provideToSP = async (_amount: number, _frontEndTag: string) => {
    try {
        const provideToSP = await (await callStabilityPoolContract()).contractWithSigner.provideToSP(_amount, _frontEndTag);
        return await provideToSP;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const withdrawFromSP = async (_amount: number) => {
    try {
        const withdrawFromSP = await (await callStabilityPoolContract()).contractWithSigner.withdrawFromSP(_amount);
        return await withdrawFromSP;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const withdrawETHGainToTrove = async (_upperHint: string, _lowerHint: string) => {
    try {
        const withdrawETHGainToTrove = await (await callStabilityPoolContract()).contractWithSigner.withdrawETHGainToTrove(_upperHint, _lowerHint);
        return await withdrawETHGainToTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const offset = async (_debtToOffset: number, _collToAdd: number) => {
    try {
        const offset = await (await callStabilityPoolContract()).contractWithSigner.offset(_debtToOffset, _collToAdd);
        return await offset;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getDepositorETHGain = async (_depositor: string) => {
    try {
        const getDepositorETHGain = await (await callStabilityPoolContract()).contractWithSigner.getDepositorETHGain(_depositor);
        return await getDepositorETHGain;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getCompoundedAUSDDeposit = async (_depositor: string) => {
    try {
        const getCompoundedAUSDDeposit = await (await callStabilityPoolContract()).contractWithSigner.getCompoundedAUSDDeposit(_depositor);
        return await getCompoundedAUSDDeposit;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getCompoundedFrontEndStake = async (_frontEnd: string) => {
    try {
        const getCompoundedFrontEndStake = await (await callStabilityPoolContract()).contractWithSigner.getCompoundedFrontEndStake(_frontEnd);
        return await getCompoundedFrontEndStake;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const registerFrontEnd = async (_kickbackRate: number) => {
    try {
        const registerFrontEnd = await (await callStabilityPoolContract()).contractWithSigner.registerFrontEnd(_kickbackRate);
        return await registerFrontEnd;
    } catch (error) {
        console.log(error);
        return false;
    }
}


//borrowerOperations Contract Functions
export const callOpenTrove = async (_maxFeePercentage: number, _AUSDAmount: number, _upperHint: string, _lowerHint: string, _value: ethers.BigNumberish ) => {
    try {
        const openTrove = await (await callBorrowerOperationsContract()).contractWithSigner.openTrove(_maxFeePercentage, _AUSDAmount, _upperHint, _lowerHint,{ value: _value });
        return await openTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callAddColl = async (_upperHint: string, _lowerHint: string) => {
    try {
        const addColl = await (await callBorrowerOperationsContract()).contractWithSigner.addColl(_upperHint, _lowerHint);
        return await addColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callEntireSystemColl = async () => {
    try {
        const entireSystemColl = await (await callBorrowerOperationsContract()).contractWithSigner.entireSystemColl();
        return await entireSystemColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callEntireSystemDebt = async () => {
    try {
        const entireSystemDebt = await (await callBorrowerOperationsContract()).contractWithSigner.entireSystemDebt();
        return await entireSystemDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callGetAUSDValue = async (_coll: number) => {
    try {
        const getAUSDValue = await (await callBorrowerOperationsContract()).contractWithSigner.getAUSDValue(_coll);
        return await getAUSDValue;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callCloseTrove = async (_borrower: string) => {
    try {
        const closeTrove = await (await callBorrowerOperationsContract()).contractWithSigner.closeTrove(_borrower);
        return await closeTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callRepayAUSD = async (_AUSDAmount: number, _upperHint: string, _lowerHint: string) => {
    try {
        const repayAUSD = await (await callBorrowerOperationsContract()).contractWithSigner.repayAUSD(_AUSDAmount, _upperHint, _lowerHint);
        return await repayAUSD;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callMoveETHGainToTrove = async (_borrower: string, _upperHint: string, _lowerHint: string) => {
    try {
        const moveETHGainToTrove = await (await callBorrowerOperationsContract()).contractWithSigner.moveETHGainToTrove(_borrower, _upperHint, _lowerHint);
        return await moveETHGainToTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callWithdrawColl = async (_collWithdrawal: number, _upperHint: string, _lowerHint: string) => {
    try {
        const withdrawColl = await (await callBorrowerOperationsContract()).contractWithSigner.withdrawColl(_collWithdrawal, _upperHint, _lowerHint);
        return await withdrawColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callWithdrawAUSD = async (_maxFeePercentage: number, _AUSDAmount: number, _upperHint: string, _lowerHint: string) => {
    try {
        const withdrawAUSD = await (await callBorrowerOperationsContract()).contractWithSigner.withdrawAUSD(_maxFeePercentage, _AUSDAmount, _upperHint, _lowerHint);
        return await withdrawAUSD;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callAdjustTrove = async (_maxFeePercentage: number, _collWithdrawal: number, _AUSDChange: boolean, _isDebtIncrease: boolean, _upperHint: string, _lowerHint: string) => {
    try {
        const adjustTrove = await (await callBorrowerOperationsContract()).contractWithSigner.adjustTrove(_maxFeePercentage, _collWithdrawal, _AUSDChange, _isDebtIncrease, _upperHint, _lowerHint);
        return await adjustTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callBorrowerOperationsSetAddresses = async (_troveManagerAddress: string, _activePoolAddress: string, _defaultPoolAddress: string, _stabilityPoolAddress: string, _collSurplusPoolAddress: string, _priceFeedAddress: string, _sortedTrovesAddress: string, _AUSDTokenAddress: string, _feeTaker: string) => {
    try {
        const setAddresses = await (await callBorrowerOperationsContract()).contractWithSigner.setAddresses(_troveManagerAddress, _activePoolAddress, _defaultPoolAddress, _stabilityPoolAddress, _collSurplusPoolAddress, _priceFeedAddress, _sortedTrovesAddress, _AUSDTokenAddress, _feeTaker);
        return await setAddresses;
    } catch (error) {
        console.log(error);
        return false;
    }
};


// TroveManager Contract

export const callBatchLiquidateTroves = async (_troveArray: string[]) => { 
    try {
        const batchLiquidateTroves = await (await callTroveManagerContract()).contractWithSigner.batchLiquidateTroves(_troveArray);
        return await batchLiquidateTroves;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetNominalICR = async (_borrower: string) => {
    try {
        const getNominalICR = await (await callTroveManagerContract()).contractWithSigner.getNominalICR(_borrower);
        return await getNominalICR;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callGetCurrentICR = async (_borrower: string, _price: number) => {
    try {
        const getCurrentICR = await (await callTroveManagerContract()).contractWithSigner.getCurrentICR(_borrower, _price);
        return await getCurrentICR;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetPendingETHReward = async (_borrower: string) => {
    try {
        const getPendingETHReward = await (await callTroveManagerContract()).contractWithSigner.getPendingETHReward(_borrower);
        return await getPendingETHReward;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetPendingAUSDDebtReward = async (_borrower: string) => {
    try {
        const getPendingAUSDDebtReward = await (await callTroveManagerContract()).contractWithSigner.getPendingAUSDDebtReward(_borrower);
        return await getPendingAUSDDebtReward;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callHasPendingRewards = async (_borrower: string) => {
    try {
        const hasPendingRewards = await (await callTroveManagerContract()).contractWithSigner.hasPendingRewards(_borrower);
        return await hasPendingRewards;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetEntireDebtAndColl = async (_borrower: string) => {
    try {
        const getEntireDebtAndColl = await (await callTroveManagerContract()).contractWithSigner.getEntireDebtAndColl(_borrower);
        return await getEntireDebtAndColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetRedemptionRate = async () => {
    try {
        const getRedemptionRate = await (await callTroveManagerContract()).contractWithSigner.getRedemptionRate();
        return await getRedemptionRate;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callGetBorrowingRate = async () => {
    try {
        const getBorrowingRate = await (await callTroveManagerContract()).contractWithSigner.getBorrowingRate();
        return await getBorrowingRate;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingRateWithDecay = async () => {
    try {
        const getBorrowingRateWithDecay = await (await callTroveManagerContract()).contractWithSigner.getBorrowingRateWithDecay();
        return await getBorrowingRateWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callTroveManagerSetAddresses = async (_borrowerOperationsAddress: string, _activePoolAddress: string, _defaultPoolAddress: string, _stabilityPoolAddress: string, _collSurplusPoolAddress: string, _priceFeedAddress: string, _AUSDTokenAddress: string, _sortedTrovesAddress: string) => {
    try {
        const setAddresses = await (await callTroveManagerContract()).contractWithSigner.setAddresses(_borrowerOperationsAddress, _activePoolAddress, _defaultPoolAddress, _stabilityPoolAddress, _collSurplusPoolAddress, _priceFeedAddress, _AUSDTokenAddress, _sortedTrovesAddress);
        return await setAddresses;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveOwnersCount = async () => {
    try {
        const getTroveOwnersCount = await (await callTroveManagerContract()).contractWithSigner.getTroveOwnersCount();
        return await getTroveOwnersCount;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callGetTroveFromTroveOwnersArray = async (_index: number) => {
    try {
        const getTroveFromTroveOwnersArray = await (await callTroveManagerContract()).contractWithSigner.getTroveFromTroveOwnersArray(_index);
        return await getTroveFromTroveOwnersArray;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callLiquidate = async (borrower: string) => {
    try {
        const liquidate = await (await callTroveManagerContract()).contractWithSigner.liquidate(borrower);
        return await liquidate;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callLiquidateTroves = async (n: number) => {
    try {
        const liquidateTroves = await (await callTroveManagerContract()).contractWithSigner.liquidateTroves(n);
        return await liquidateTroves;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callRedeemCollateral = async (_AUSDamount: number, _firstRedemptionHint: string, _upperPartialRedemptionHint: string, _lowerPartialRedemptionHint:string, _partialRedemptionHintNICR: number, _maxIterations: number, _maxFeePercentage: number) => {
    try {
        const redeemCollateral = await (await callTroveManagerContract()).contractWithSigner.redeemCollateral(_AUSDamount, _firstRedemptionHint, _upperPartialRedemptionHint, _lowerPartialRedemptionHint, _partialRedemptionHintNICR, _maxIterations, _maxFeePercentage);
        return await redeemCollateral;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callApplyPendingRewards = async (borrower: string) => {
    try {
        const applyPendingRewards = await (await callTroveManagerContract()).contractWithSigner.applyPendingRewards(borrower);
        return await applyPendingRewards;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callUpdateTroveRewardSnapshots = async (borrower: string) => {
    try {
        const updateTroveRewardSnapshots = await (await callTroveManagerContract()).contractWithSigner.updateTroveRewardSnapshots(borrower);
        return await updateTroveRewardSnapshots;
    } catch (error) {
        console.log(error);
        return false;
    }
};




export const callRemoveStake = async (borrower: string) => {
    try {
        const removeStake = await (await callTroveManagerContract()).contractWithSigner.removeStake(borrower);
        return await removeStake;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callUpdateStakeAndTotalStakes = async (borrower: string) => {
    try {
        const updateStakeAndTotalStakes = await (await callTroveManagerContract()).contractWithSigner.updateStakeAndTotalStakes(borrower);
        return await updateStakeAndTotalStakes;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callCloseTroveTroveManager = async (borrower: string) => {
    try {
        const closeTrove = await (await callTroveManagerContract()).contractWithSigner.closeTrove(borrower);
        return await closeTrove;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callAddTroveOwnerToArray = async (borrower: string) => {
    try {
        const addTroveOwnerToArray = await (await callTroveManagerContract()).contractWithSigner.addTroveOwnerToArray(borrower);
        return await addTroveOwnerToArray;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTCR = async (price: number) => {
    try {
        const getTCR = await (await callTroveManagerContract()).contractWithSigner.getTCR(price);
        return await getTCR;
    } catch (error) {
        console.log(error);
        return false;
    }
};



export const callGetRedemptionFeeWithDecay = async (_ETHDrawn: number) => {
    try {
        const getRedemptionFeeWithDecay = await (await callTroveManagerContract()).contractWithSigner.getRedemptionFeeWithDecay(_ETHDrawn);
        return await getRedemptionFeeWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetBorrowingFee = async (_AUSDDebt: number) => {
    try {
        const getBorrowingFee = await (await callTroveManagerContract()).contractWithSigner.getBorrowingFee(_AUSDDebt);
        return await getBorrowingFee;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callGetBorrowingFeeWithDecay = async (_AUSDDebt: number) => {
    try {
        const getBorrowingFeeWithDecay = await (await callTroveManagerContract()).contractWithSigner.getBorrowingFeeWithDecay(_AUSDDebt);
        return await getBorrowingFeeWithDecay;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callDecayBaseRateFromBorrowing = async () => {
    try {
        const decayBaseRateFromBorrowing = await (await callTroveManagerContract()).contractWithSigner.decayBaseRateFromBorrowing();
        return await decayBaseRateFromBorrowing;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const callGetTroveStatus = async (borrower: string) => {
    try {
        const getTroveStatus = await (await callTroveManagerContract()).contractWithSigner.getTroveStatus(borrower);
        return await getTroveStatus;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveStake = async (borrower: string) => {
    try {
        const getTroveStake = await (await callTroveManagerContract()).contractWithSigner.getTroveStake(borrower);
        return await getTroveStake;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const callGetTroveDebt = async (borrower: string) => {
    try {
        const getTroveDebt = await (await callTroveManagerContract()).contractWithSigner.getTroveDebt(borrower);
        return await getTroveDebt;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callGetTroveColl = async (borrower: string) => {
    try {
        const getTroveColl = await (await callTroveManagerContract()).contractWithSigner.getTroveColl(borrower);
        return await getTroveColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callSetTroveStatus = async (borrower: string, num:number) => {
    try {
        const setTroveStatus = await (await callTroveManagerContract()).contractWithSigner.setTroveStatus(borrower,num);
        return await setTroveStatus;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callIncreaseTroveColl = async (borrower: string, _collIncrease:number) => {
    try {
        const increaseTroveColl = await (await callTroveManagerContract()).contractWithSigner.increaseTroveColl(borrower,_collIncrease);
        return await increaseTroveColl;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const callDecreaseTroveColl = async (borrower: string, _collDecrease:number) => {
    try {
        const decreaseTroveColl = await (await callTroveManagerContract()).contractWithSigner.decreaseTroveColl(borrower,_collDecrease);
        return await decreaseTroveColl;
    } catch (error) {   
        console.log(error);
        return false;
    }
};

export const callIncreaseTroveDebt = async (borrower: string, _debtIncrease:number) => {
    try {
        const increaseTroveDebt = await (await callTroveManagerContract()).contractWithSigner.increaseTroveDebt(borrower,_debtIncrease);
        return await increaseTroveDebt;
    } catch (error) {   
        console.log(error);
        return false;
    }
};

export const callDecreaseTroveDebt = async (borrower: string, _debtDecrease:number) => {
    try {
        const decreaseTroveDebt = await (await callTroveManagerContract()).contractWithSigner.decreaseTroveDebt(borrower,_debtDecrease);
        return await decreaseTroveDebt;
    } catch (error) {   
        console.log(error);
        return false;
    }
};

export const callTroves = async (borrower: string) => {
    try {
        const troves = await (await callTroveManagerContract()).contractWithSigner.Troves(borrower);
        return await troves;
    } catch (error) {   
        console.log(error);
        return false;
    }
};


//Sorted Troves Functions
export const callFindInsertPositon = async (_NICR: number, _prevId:string, _nextId:string) => {
    try {
        const findInsertPosition = await (await callSortedTrovesContract()).contractWithSigner.findInsertPosition(_NICR,_prevId,_nextId);
        return await findInsertPosition;
    } catch (error) {   
        console.log(error);
        return false;
    }
};
//ASUD Token Contract Functions  
export const callBalanceOf = async (borrower:string) => {
    try {
        const balanceOf = await (await callAUSDTTokenContract()).contractWithSigner.balanceOf(borrower);
        return await balanceOf;
    } catch (error) {   
        console.log(error);
        return false;
    }
};
//PriceFeed Contract Functions
export const callFetchPrice = async () => {
    try {
        const fetchPrice = await (await callPriceFeedContract()).contractWithSigner.fetchPrice();
        return await fetchPrice;
    } catch (error) {   
        console.log(error);
        return false;
    }
};
