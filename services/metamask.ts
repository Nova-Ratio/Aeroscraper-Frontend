import { getConfig } from "@/config/network";
import { useWallet } from "@/contexts/WalletProvider";
import { WalletType } from "@/enums/WalletType";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { AppConfig } from "@/config";
import ChainData from "./data/chain.json"
import Swal from "sweetalert2";
import { ToastSuccess } from "./data/alert/SweatAlert";
export type SigningMetamaskClient = {};


export async function loadMetamaskWallet(config: AppConfig): Promise<any> {
  const { ethereum }: any = window;

  if (!ethereum) {
    throw new Error("Metamask extension is not available");
  }
  const chain:any = ChainData
  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();
  const [address, chainId, networkName] = await Promise.all([
    signer.getAddress(),
    signer.provider.getNetwork().then((network: any) => network.chainId),
    signer.provider.getNetwork().then((network: any) => network.name),
  ]);
  if (chainId.toString() !== "5") {
    const { name } = chain[chainId.toString()] || {};
    const fromNetwork = name || "Unknown Network";
    const toNetwork = chain["5"]?.name || "Arbitrum Testnet";

    const result = await Swal.fire({
      title: "Please Change Network",
      text: `From ${fromNetwork} to ${toNetwork}`,
      icon: "warning",
      iconColor: "#fff",
      showCancelButton: false,
      backdrop: true,
      background: "#191919",
      confirmButtonColor: "#282828",
      color: "#fff",
      confirmButtonText: "Yes, Change It!",
    });
    if (result.isConfirmed) {
      //@ts-ignore
      window.ethereum
        ?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ChainData["5"].chainId }],
        })
        .catch(async (err: any) => {
          //@ts-ignore
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ChainData["5"].chainId,
                chainName: ChainData["5"].name,
                nativeCurrency: {
                  name: ChainData["5"].nativeCurrency.name,
                  symbol: ChainData["5"].nativeCurrency.symbol,
                  decimals: 18,
                },
                rpcUrls: ChainData["5"].rpcUrls,
                blockExplorerUrls: ChainData["5"].blockExplorerUrls,
              },
            ],
          }) /* || (await initialize()); */
        });
      if (chainId.toString() === "5") {
        ToastSuccess.fire({
          title: "Network Changed",
        });
      }
    }
  }
  return Promise.resolve({
    getAccounts: function () {
      return [{ address: getInjectiveAddress(signer.address) }];
    },
  });
}

const useMetamask = () => {
  const { init, initialized, clear, clientType, walletLoading, network } =
    useWallet();
  const [initializing, setInitializing] = useState(false);
  const config = getConfig(network, clientType);

  const connect = async (walletChange = false) => {
    if (initialized || walletLoading) return;

    setInitializing(true);

    loadMetamaskWallet(config)
      .then((signer) => {
        init(signer, WalletType.METAMASK);
        if (walletChange) setInitializing(false);
      })
      .catch((err) => {
        setInitializing(false);
        console.log(err);
      });
  };

  const disconnect = () => {
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("selectedWalletType");
    clear();
  };

  useEffect(() => {
    if (!initialized) return;

    setInitializing(false);
  }, [initialized]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      initializing,
    }),
    [connect, disconnect, initializing]
  );

  return value;
};

export default useMetamask;
