
const DEFAULT_DECIMAL = 6;
export const AUSD_PRICE = 1;

export const getRequestAmount = (value: string | number, decimal: number = DEFAULT_DECIMAL) => {
    return Math.floor((Number(value) * Math.pow(10, decimal))).toLocaleString('fullwide', { useGrouping: false });
}

export const convertAmount = (value: string | number, decimal: number = DEFAULT_DECIMAL) => {
    return Number((Number(value) / Math.pow(10, decimal)).toFixed(18));
}

export const getValueByRatio = (value: string | number, ratio: string | number) => {
    return Number((Number(value) / Number(ratio)).toFixed(6));
}

export const getRatioColor = (value: number) => {
    if (value < 115) {
        return '#cc2340';
    }
    else if (value > 115 && value < 130) {
        return '#d4b737'
    }

    return '#37D489'
}

export const getRatioText = (value: number) => {
    if (value < 115) {
        return "Troves below 115% collateral ratio will be liquidated. Your trove is in the risky troves range."
    }
    else if (value > 115 && value < 130) {
        return "Troves below 115% collateral ratio will be liquidated. Your trove's risk is moderate."
    }

    return "Troves below 115% collateral ratio will be liquidated. Your trove is in the safe range."
}

export const getIsInjectiveResponse = (res?: any ): any => (res)?.txHash