import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig, getFinConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { WalletType } from "../enums/WalletType";

export async function loadFinWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;
    if (!anyWindow.fin.getOfflineSigner) {
        throw new Error("Fin extension is not available");
    }

    anyWindow.fin.experimentalSuggestChain(getFinConfig(config))
    await anyWindow.fin.enable(config.chainId)

    const signer = await anyWindow.fin.getOfflineSignerAuto(config.chainId);
    signer.signAmino = signer.signAmino ?? signer.sign;

    return Promise.resolve(signer);
}

export function useFin() {
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

        loadFinWallet(config)
            .then((signer) => {
                init(signer, WalletType.FIN);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                setInitializing(false);
                //window.open("https://chrome.google.com/webstore/detail/fin-wallet-for-sei/dbgnhckhnppddckangcjbkjnlddbjkna", '_blank', 'noopener,noreferrer');
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
