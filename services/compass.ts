import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig, getCompassConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { WalletType } from "../enums/WalletType";

export async function loadCompassWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;

    if (!anyWindow.compass.getOfflineSigner) {
        throw new Error("Compass extension is not available");
    }

    await anyWindow.compass.experimentalSuggestChain(getCompassConfig(config))
    await anyWindow.compass.enable(config.chainId)

    const signer = await anyWindow.compass.getOfflineSignerAuto(config.chainId);
    signer.signAmino = signer.signAmino ?? signer.sign;

    return Promise.resolve(signer);
}

export function useCompass() {
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

        loadCompassWallet(config)
            .then((signer) => {
                init(signer, WalletType.COMPASS);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                setInitializing(false);
                //window.open("https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb", '_blank', 'noopener,noreferrer');
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
