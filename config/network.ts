import { ClientEnum } from "@/types/types"
import { AppConfig } from "./app"

export const mainnetArchwayConfig: AppConfig = {
    chainId: 'archway-1',
    chainName: 'Archway Mainnet',
    addressPrefix: 'archway',
    rpcUrl: 'https://rpc.mainnet.archway.io:443',
    httpUrl: 'https://api.mainnet.archway.io',
    feeToken: 'ARCH',
    stakingToken: 'ARCH',
    coinMap: {
        ARCH: { denom: 'ARCH', fractionalDigits: 18 },
    },
    gasPrice: 0.025,
    fees: {
        upload: 1500000,
        init: 500000,
        exec: 200000,
    },
}

export const mainnetConfig: AppConfig = {
    chainId: 'pacific-1',
    chainName: 'Sei Mainnet',
    addressPrefix: 'sei',
    rpcUrl: 'https://sei-rpc.polkachu.com/',
    httpUrl: 'https://sei-api.polkachu.com/',
    feeToken: 'usei',
    stakingToken: 'usei',
    coinMap: {
        usei: { denom: 'SEI', fractionalDigits: 6 },
    },
    gasPrice: 0.025,
    fees: {
        upload: 1500000,
        init: 500000,
        exec: 200000,
    },
}

export const uniTestnetConfig: AppConfig = {
    chainId: 'pacific-1',
    chainName: 'Sei Mainnet',
    addressPrefix: 'sei',
    rpcUrl: 'https://sei-rpc.brocha.in/',
    httpUrl: 'https://sei-rest.brocha.in/',
    feeToken: 'usei',
    stakingToken: 'usei',
    coinMap: {
        usei: { denom: 'SEI', fractionalDigits: 6 },
    }
}

export const getConfig = (network: string, clientType?: ClientEnum): AppConfig => {
    /* if (network === 'mainnet') return mainnetConfig
    return mainnetConfig */
    if (clientType === ClientEnum.ARCHWAY) {
        return mainnetArchwayConfig
    }

    return uniTestnetConfig
}