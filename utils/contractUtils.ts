import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { Coin, EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";

const DEFAULT_DECIMAL = 6;

export const jsonToBinary = (json: any) => {
    return toBase64(toUtf8(JSON.stringify(json)));
};

export const getAllowanceExecuteMsg = ({
    sender,
    contract = '',
    amount,
    spender,
    funds = []
}: {
    sender: string,
    contract?: string,
    amount: string,
    spender: string,
    funds?: Coin[]
}): EncodeObject => {
    return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender,
            contract,
            msg: toUtf8(
                JSON.stringify({
                    increase_allowance: {
                        amount,
                        spender
                    }
                })
            ),
            funds
        })
    }
}

export const getEncodedExecuteJsonMsg = (sender: string, contract: string, msg: any, funds?: Coin[]): EncodeObject => {
    return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender,
            contract,
            msg: toUtf8(
                JSON.stringify(msg)
            ),
            funds: funds ?? []
        })
    }
}

export const getRequestAmount = (value: string | number, decimal: number = DEFAULT_DECIMAL) => {
    return Math.floor((Number(value) * Math.pow(10, decimal))).toString();
}

export const convertAmount = (value: string | number, decimal: number = DEFAULT_DECIMAL) => {
    return Number((Number(value) / Math.pow(10, decimal)).toFixed(6));
}

export const getValueByRatio = (value: string | number, ratio: string | number) => {
    return Number((Number(value) * Number(ratio)).toFixed(6));
}