import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig, getLeapConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { WalletType } from "../enums/WalletType";

export async function loadLeapWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;

    if (!anyWindow.leap.getOfflineSigner) {
        throw new Error("Leap extension is not available");
    }

    await anyWindow.leap.experimentalSuggestChain(getLeapConfig(config))
    await anyWindow.leap.enable(config.chainId)

    const signer = await anyWindow.leap.getOfflineSignerAuto(config.chainId);
    signer.signAmino = signer.signAmino ?? signer.sign;

    return Promise.resolve(signer);
}

export function useLeap() {
    const { clear, init, initialized, network, walletLoading } = useWallet();
    const [initializing, setInitializing] = useState(false);
    const config = getConfig(network);

    const disconnect = () => {
        localStorage.removeItem("wallet_address");
        localStorage.removeItem("selectedWalletType");
        clear();
    };

    const connect = (walletChange = false) => {
        if (initialized || walletLoading) return;

        setInitializing(true);

        loadLeapWallet(config)
            .then((signer) => {
                init(signer, WalletType.LEAP);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                setInitializing(false);
                //window.open("https://www.leapwallet.io/", '_blank', 'noopener,noreferrer');
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
