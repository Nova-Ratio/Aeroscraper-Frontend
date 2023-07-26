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