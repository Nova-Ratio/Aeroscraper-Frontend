export type GetTroveResponse = {
    collateral_amount: string;
    debt_amount: string;
}

export type GetStakeResponse = {
    amount: string;
    percentage: number;
}

export type CW20BalanceResponse = {
    balance: string;
}

export type CW20TokenInfoResponse = {
    name: string;
    symbol: string;
    decimals: number;
    total_supply: string;
}