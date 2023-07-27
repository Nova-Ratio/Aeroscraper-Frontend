import { getRequestAmount, jsonToBinary } from "@/utils/contractUtils";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { coin } from "@cosmjs/proto-signing";
import { CW20BalanceResponse, CW20TokenInfoResponse, GetStakeResponse, GetTroveResponse } from "./types";

export const getAppContract = (client: SigningCosmWasmClient) => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const ausdContractAddress = process.env.NEXT_PUBLIC_AUSD_CONTRACT_ADDRESS as string;

    //GET QUERIES
    const getTotalCollateralAmount = async (): Promise<string> => {
        return await client.queryContractSmart(contractAddress, { total_collateral_amount: {} });
    }

    const getTotalDebtAmount = async (): Promise<string> => {
        return await client.queryContractSmart(contractAddress, { total_debt_amount: {} });
    }

    const getTrove = async (user_addr: string): Promise<GetTroveResponse> => {
        return await client.queryContractSmart(contractAddress, { trove: { user_addr } });
    }

    const getStake = async (user_addr: string): Promise<GetStakeResponse> => {
        return await client.queryContractSmart(contractAddress, { stake: { user_addr } });
    }

    const getTotalStake = async (): Promise<string> => {
        return await client.queryContractSmart(contractAddress, { total_stake_amount: {} });
    }

    const getCollateralPrice = async () => {
        return await client.queryContractSmart(contractAddress, { collateral_price: {} });
    }

    const getAusdBalance = async (address: string): Promise<CW20BalanceResponse> => {
        return await client.queryContractSmart(ausdContractAddress, { balance: { address } })
    }

    const getAusdInfo = async (): Promise<CW20TokenInfoResponse> => {
        return await client.queryContractSmart(ausdContractAddress, { token_info: {} })
    }

    //EXECUTE QUERIES
    const openTrove = async (senderAddress: string, amount: number, loanAmount: number) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { open_trove: { loan_amount: getRequestAmount(loanAmount) } },
            "auto",
            "Open Trove",
            [coin(getRequestAmount(amount), "usei")]
        )
    }

    const addCollateral = async (senderAddress: string, amount: number) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { add_collateral: {} },
            "auto",
            "Add Collateral",
            [coin(getRequestAmount(amount), "usei")]
        )
    }

    const removeCollateral = async (senderAddress: string, amount: number) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { remove_collateral: { collateral_amount: getRequestAmount(amount) } },
            "auto",
            "Remove Collateral"
        )
    }

    const borrowLoan = async (senderAddress: string, amount: number) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { borrow_loan: { loan_amount: getRequestAmount(amount) } },
            "auto",
            "Borrow Loan"
        )
    }

    const repayLoan = async (senderAddress: string, amount: number) => {
        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ repay_loan: {} })
            }
        }

        return client.execute(
            senderAddress,
            ausdContractAddress,
            msg,
            "auto",
            "Repay Loan"
        )
    }

    const stake = async (senderAddress: string, amount: number) => {
        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ stake: {} })
            }
        }

        return client.execute(
            senderAddress,
            ausdContractAddress,
            msg,
            "auto",
            "Stake"
        )
    }

    const unstake = async (senderAddress: string, amount: number) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { unstake: { amount: getRequestAmount(amount) } },
            "auto",
            "Unstake"
        )
    }

    const redeem = async (senderAddress: string, amount: number) => {
        const msg = {
            send: {
                contract: contractAddress,
                amount: getRequestAmount(amount),
                msg: jsonToBinary({ redeem: {} })
            }
        }

        return client.execute(
            senderAddress,
            ausdContractAddress,
            msg,
            "auto",
            "Redeem"
        )
    }

    const liquidateTroves = async (senderAddress: string) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { liquidate_troves: {} },
            "auto",
            "Liquidate Troves"
        )
    }

    const withdrawLiquidationGains = async (senderAddress: string) => {
        return await client.execute(
            senderAddress,
            contractAddress,
            { withdraw_liquidation_gains: {} },
            "auto",
            "Withdraw Liquidation Gains"
        )
    }

    return {
        getTotalCollateralAmount,
        getTotalDebtAmount,
        getTrove,
        getStake,
        getTotalStake,
        getCollateralPrice,
        getAusdBalance,
        getAusdInfo,
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
    }
}