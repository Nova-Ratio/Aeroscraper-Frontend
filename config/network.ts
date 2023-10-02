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
        'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2': { denom: 'ATOM', fractionalDigits: 6 }
    },
    gasPrice: 0.025,
    fees: {
        upload: 1500000,
        init: 500000,
        exec: 200000,
    },
}

export const mainnetNeutronConfig: AppConfig = {
    chainId: 'neutron-1',
    chainName: 'neutron',
    addressPrefix: 'neutron',
    rpcUrl: 'https://rpc-kralum.neutron-1.neutron.org',
    httpUrl: 'https://rest-kralum.neutron-1.neutron.org',
    feeToken: 'untrn',
    stakingToken: 'untrn',
    coinMap: {
        NTRN: { denom: 'NTRN', fractionalDigits: 6 },
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
    rpcUrl: 'https://rpc-sei.stingray.plus/',
    httpUrl: 'https://api-sei.stingray.plus/',
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
    if (clientType === ClientEnum.NEUTRON) {
        return mainnetNeutronConfig
    }

    return uniTestnetConfig
}