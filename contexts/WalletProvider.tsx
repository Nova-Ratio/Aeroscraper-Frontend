"use client"

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningArchwayClient } from "@archwayhq/arch3.js"
import { OfflineSigner } from "@cosmjs/proto-signing";
import { Coin } from "@cosmjs/stargate";
import { Dictionary, isNil } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { getConfig } from "@/config";
import _ from 'lodash';
import { Decimal } from "@cosmjs/math";
import { WalletType } from "@/enums/WalletType";
import { useCompass } from "@/services/compass";
import { useFin } from "@/services/fin";
import { useKeplr } from "@/services/keplr";
import { useLeap } from "@/services/leap";
import { BaseCoin, ClientEnum } from "@/types/types";
import { getBaseCoinByClient } from "@/constants/walletConstants";

const SideEffects = () => {
    const leap = useLeap();
    const keplr = useKeplr();
    const fin = useFin();
    const compass = useCompass();

    useEffect(() => {
        const listenKeplrKeystoreChange = () => keplr.connect(true);
        const listenLeapKeystoreChange = () => leap.connect(true);
        const listenFinKeystoreChange = () => fin.connect(true);
        const listenCompassKeystoreChange = () => compass.connect(true);
        window.addEventListener("keplr_keystorechange", listenKeplrKeystoreChange);
        window.addEventListener("leap_keystorechange", listenLeapKeystoreChange);
        window.addEventListener("fin_keystorechange", listenFinKeystoreChange);
        window.addEventListener("compass_keystorechange", listenCompassKeystoreChange);
        return () => {
            window.removeEventListener("keplr_keystorechange", listenKeplrKeystoreChange);
            window.removeEventListener("leap_keystorechange", listenLeapKeystoreChange);
            window.removeEventListener("fin_keystorechange", listenFinKeystoreChange);
            window.removeEventListener("compass_keystorechange", listenCompassKeystoreChange);
        };
    }, [leap, keplr, fin, compass]);

    useEffect(() => {
        const walletAddress = localStorage.getItem("wallet_address");
        const selectedWalletType = localStorage.getItem("selectedWalletType");
        if (walletAddress) {
            if (selectedWalletType === WalletType.KEPLR) {
                keplr.connect();
            }
            else if (selectedWalletType === WalletType.LEAP) {
                leap.connect();
            }
            else if (selectedWalletType === WalletType.FIN) {
                fin.connect();
            }
            else if (selectedWalletType === WalletType.COMPASS) {
                compass.connect();
            }
        }
    }, [leap, keplr, fin, compass]);

    return null;
};

export async function createClient(
    signer: OfflineSigner,
    network: string,
    clientType?: ClientEnum
): Promise<SigningCosmWasmClient | SigningArchwayClient> {
    const config = getConfig(network, clientType);

    if (clientType === ClientEnum.ARCHWAY) {
        return SigningArchwayClient.connectWithSigner(config.rpcUrl, signer, {
            gasPrice: {
                amount: Decimal.fromUserInput("0.0025", 100),
                denom: config.feeToken,
            },
        });
    }else if (clientType === ClientEnum.NEUTRON) {        
        return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
            gasPrice: {
                amount: Decimal.fromUserInput("0.0025", 100),
                denom: config.feeToken,
            },
        });
    }

    return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
        gasPrice: {
            amount: Decimal.fromUserInput("0.0025", 100),
            denom: config.feeToken,
        },
    });
}

export interface WalletContextType {
    readonly initialized: boolean;
    readonly init: (signer: OfflineSigner, walletType: WalletType) => void;
    readonly clear: () => void;
    readonly address: string;
    readonly name: string;
    readonly balance: readonly Coin[];
    readonly refreshBalance: () => Promise<void>;
    readonly getClient: () => SigningCosmWasmClient | SigningArchwayClient;
    readonly getSigner: () => OfflineSigner;
    readonly updateSigner: (singer: OfflineSigner) => void;
    readonly network: string;
    readonly setNetwork: (network: string) => void;
    readonly balanceByDenom: Dictionary<Coin | undefined>;
    readonly walletLoading: boolean;
    readonly walletType: WalletType | undefined;
    readonly profileDetail: ProfileDetailModel | undefined;
    readonly setProfileDetail: (profile: ProfileDetailModel | undefined) => void;
    readonly processLoader: boolean;
    readonly setProcessLoader: (arg: boolean) => void;
    // readonly accountNumber: number;
    readonly clientType: ClientEnum | undefined;
    readonly selectClientType: (value: ClientEnum | undefined) => void;
    readonly baseCoin: BaseCoin | undefined;
}

function throwNotInitialized(): any {
    console.log("Wallet not initialized.")
    //throw new Error("Not yet initialized");
}

const defaultContext: WalletContextType = {
    initialized: false,
    init: throwNotInitialized,
    clear: throwNotInitialized,
    address: "",
    name: "",
    balance: [],
    refreshBalance: throwNotInitialized,
    getClient: throwNotInitialized,
    getSigner: throwNotInitialized,
    updateSigner: throwNotInitialized,
    network: "",
    setNetwork: throwNotInitialized,
    balanceByDenom: {},
    walletLoading: false,
    walletType: undefined,
    processLoader: false,
    profileDetail: undefined,
    setProfileDetail: throwNotInitialized,
    setProcessLoader: throwNotInitialized,
    clientType: undefined,
    selectClientType: () => { },
    baseCoin: undefined
    // accountNumber: 0,
};

const groupBalanceByDenom = (balances: Coin[]): Dictionary<Coin> => {
    return _.chain(balances).keyBy(balance => balance.denom).value();
}

export interface ProfileDetailModel {
    walletAddress: string,
    photoUrl: string,
    appType: number
    balance?: number
}

export const WalletContext =
    React.createContext<WalletContextType>(defaultContext);

export const useWallet = (): WalletContextType =>
    React.useContext(WalletContext);

export function WalletProvider({
    children,
    network,
    setNetwork,
}: any): JSX.Element {
    const [walletLoading, setWalletLoading] = useState(false);
    const [processLoader, setProcessLoader] = useState(false);
    const [signer, setSigner] = useState<OfflineSigner>();
    const [client, setClient] = useState<SigningCosmWasmClient | SigningArchwayClient>();
    const [walletType, setWalletType] = useState<WalletType | undefined>(undefined);
    const [clientType, setClientType] = useState<ClientEnum | undefined>(undefined);
    const [profileDetail, setProfileDetail] = useState<ProfileDetailModel | undefined>(undefined);

    const config = getConfig(network, clientType);

    const baseCoin = React.useMemo(() => getBaseCoinByClient(clientType), [clientType])

    const selectClientType = React.useCallback((value: ClientEnum | undefined) => {
        setClientType(value);
        if (!isNil(value)) {
            localStorage.setItem("selectedClientType", value);
        }
        else {
            localStorage.removeItem("selectedClientType");
        }
    }, [])

    const init = React.useCallback((signer: OfflineSigner, walletType: WalletType) => {
        setSigner(signer);
        setWalletType(walletType)
        localStorage.setItem("selectedWalletType", walletType);
    }, [])

    const contextWithInit: WalletContextType = {
        ...defaultContext,
        init,
        network,
        setNetwork,
        walletLoading,
        processLoader,
        setProcessLoader
    };

    const [value, setValue] = useState<WalletContextType>(contextWithInit);

    const clear = React.useCallback((): void => {
        setValue({ ...contextWithInit });
        setClient(undefined);
        setSigner(undefined);
        setWalletType(undefined);
        setClientType(undefined);
        localStorage.removeItem("selectedClientType");
        localStorage.setItem("selectedWalletType", WalletType.NOT_SELECTED);
    }, []);
    // Get balance for each coin specified in config.coinMap
    async function refreshBalance(
        address: string,
        balance: Coin[]
    ) {
        if (!client) return

        try {
            balance.length = 0
            for (const denom in config.coinMap) {
                const coin = await client.getBalance(address, denom)
                if (coin) balance.push(coin)
            }
            setValue({ ...value, balance, balanceByDenom: groupBalanceByDenom(balance) })
        }
        catch (err) {
            console.error(err);
        }
    }

    const updateSigner = (signer: OfflineSigner) => {
        setSigner(signer);
    };

    useEffect(() => {
        const getProfileDetail = async () => {
            if (value.address) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API}/api/users/profile-detail`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            walletAddress: value.address,
                            appType: 999
                        })
                    });
                    if (response.status === 200) {
                        const data = await response.json();

                        setProfileDetail(data);

                        localStorage.setItem("profile-detail", JSON.stringify(data));
                    }

                }
                catch (error) {
                    console.error(error);
                }
            }
        }

        getProfileDetail();

    }, [value.address]);

    useEffect(() => {
        if (!signer) return;
        (async function updateClient(): Promise<void> {
            try {
                setWalletLoading(true);                
                const client = await createClient(signer, network, clientType);
                setClient(client);
            } catch (error) {
                console.log(error);
                setWalletLoading(false);
                setWalletType(undefined);
                setClientType(undefined);
                localStorage.removeItem("selectedClientType");
                localStorage.setItem("selectedWalletType", WalletType.NOT_SELECTED);
            }
        })();
    }, [signer, clientType]);

    useEffect(() => {
        if (!signer || !client) return;

        const balance: Coin[] = [];

        async function updateValue() {
            if (signer && client) {
                const address = (await signer.getAccounts())[0].address

                const anyWindow = window as any

                const selectedWalletType = walletType;
                let walletName = '';

                if (selectedWalletType === WalletType.KEPLR) {
                    const keplrKey = await anyWindow.keplr.getKey(config.chainId)
                    walletName = keplrKey.name;
                }
                else if (selectedWalletType === WalletType.LEAP) {
                    const leapKey = await anyWindow.leap.getKey(config.chainId)
                    walletName = leapKey.name;
                }
                else if (selectedWalletType === WalletType.COMPASS) {
                    const compassKey = await anyWindow.compass.getKey(config.chainId)
                    walletName = compassKey.name;
                }
                else if (selectedWalletType === WalletType.FIN) {
                    const finKey = await anyWindow.fin.getKey(config.chainId)
                    walletName = finKey.name;
                }

                await refreshBalance(address, balance)

                localStorage.setItem('wallet_address', address)

                setValue({
                    initialized: true,
                    init: () => { },
                    clear,
                    address,
                    name: walletName,
                    balance,
                    refreshBalance: refreshBalance.bind(null, address, balance),
                    getClient: () => client,
                    getSigner: () => signer,
                    updateSigner,
                    network,
                    setNetwork,
                    balanceByDenom: groupBalanceByDenom(balance),
                    walletLoading: false,
                    walletType,
                    profileDetail,
                    setProfileDetail(profile) {
                        setProfileDetail(profile)
                    },
                    processLoader,
                    setProcessLoader,
                    clientType,
                    selectClientType,
                    baseCoin
                })
                setWalletLoading(false);
            }
        }

        if (signer && client) {
            updateValue()
        }
    }, [client]);

    useEffect(() => {
        const savedClientType = localStorage.getItem("selectedClientType");
        console.log(savedClientType)
        setClientType(savedClientType as (ClientEnum | undefined));
    }, [])

    useEffect(() => {
        setValue({ ...value, network });
    }, [network]);

    useEffect(() => {
        const listenFunc = (e: any) => {
            setProcessLoader(e?.detail?.fetching ?? false);
        }
        window.addEventListener('process-loading', listenFunc);
        return () => window.removeEventListener('process-loading', listenFunc)
    }, [setProcessLoader])

    const providedValue = React.useMemo(() => ({
        ...value,
        walletLoading,
        walletType,
        processLoader,
        profileDetail,
        clientType,
        selectClientType,
        baseCoin
    }), [value, walletLoading, walletType, processLoader, profileDetail, clientType, selectClientType, baseCoin])

    return (
        <WalletContext.Provider value={providedValue}>
            {children}
            <SideEffects />
        </WalletContext.Provider>
    );
}
