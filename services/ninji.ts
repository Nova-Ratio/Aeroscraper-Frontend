import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { WalletType } from "../enums/WalletType";

export async function loadNinjiWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;

    if (!anyWindow.ninji.getOfflineSigner) {
        throw new Error("ninji extension is not available");
    }

    await anyWindow.ninji.enable(config.chainId)    

    const signer = await anyWindow.ninji.getOfflineSigner(config.chainId);    
    signer.signAmino = signer.signAmino ?? signer.sign;
    
    return Promise.resolve(signer);
}

export function useNinji() {
    const { clear, init, initialized, network, walletLoading, clientType } = useWallet();
    const [initializing, setInitializing] = useState(false);
    const config = getConfig(network, clientType);

    const disconnect = () => {
        localStorage.removeItem("wallet_address");
        localStorage.removeItem("selectedWalletType");
        clear();
    };

    const connect = (walletChange = false) => {
        if (initialized || walletLoading) return;

        setInitializing(true);

        loadNinjiWallet(config)
            .then((signer) => {
                init(signer, WalletType.KEPLR);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                setInitializing(false);
                console.log(err)
            });
    };

    useEffect(() => {
        if (!initialized) return;

        setInitializing(false);
    }, [initialized]);

    const value = useMemo(() => ({
        connect,
        disconnect,
        initializing
    }), [
        connect,
        disconnect,
        initializing
    ])

    return value;
}
