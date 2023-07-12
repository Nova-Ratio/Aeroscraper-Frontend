import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig, keplrConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { WalletType } from "../enums/WalletType";

export async function loadKeplrWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;

    if (!anyWindow.keplr.getOfflineSigner) {
        throw new Error("Keplr extension is not available");
    }

    await anyWindow.keplr.experimentalSuggestChain(keplrConfig(config))
    await anyWindow.keplr.enable(config.chainId)

    const signer = await anyWindow.keplr.getOfflineSignerAuto(config.chainId);
    signer.signAmino = signer.signAmino ?? signer.sign;

    return Promise.resolve(signer);
}

export function useKeplr() {
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

        loadKeplrWallet(config)
            .then((signer) => {
                init(signer, WalletType.KEPLR);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                setInitializing(false);
                //window.open("https://www.keplr.app/", '_blank', 'noopener,noreferrer');
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
