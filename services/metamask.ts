import { getConfig } from "@/config/network";
import { useWallet } from "@/contexts/WalletProvider";
import { WalletType } from "@/enums/WalletType";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { AppConfig } from "@/config";
import ChainData from "./data/chain.json"
import Swal from "sweetalert2";
import { ToastError, ToastSuccess } from "./data/alert/SweatAlert";
import { EthereumChainId } from '@injectivelabs/ts-types';

export type SigningMetamaskClient = {};


export async function loadMetamaskWallet(config: AppConfig): Promise<any> {
  const { ethereum }: any = window;

  if (!ethereum) {
    throw new Error("Metamask extension is not available");
  }
  const chain: any = ChainData
  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();
  const { chainId, name } = await signer.provider.getNetwork().then((network: any) => network);

  if (chainId != EthereumChainId.Goerli) {
    const fromNetwork: string = name;
    const toNetwork: string = chain[EthereumChainId.Goerli]?.name;

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
      ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ChainData[`${EthereumChainId.Goerli}`].chainId }],
      })
        .catch(async (err: any) => {
         return ToastError.fire({
            title: "Network is not suitable"
          });
        });
      if (chainId == EthereumChainId.Goerli) {
        ToastSuccess.fire({
          title: "Network Changed"
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
