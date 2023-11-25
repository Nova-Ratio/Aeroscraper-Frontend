import { getConfig } from '@/config/network';
import { useWallet } from '@/contexts/WalletProvider'
import { WalletType } from '@/enums/WalletType';
import {  getInjectiveAddress } from '@injectivelabs/sdk-ts';
import { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers';
import { AppConfig } from '@/config';

export type SigningMetamaskClient = {}

export async function loadMetamaskWallet(
  config: AppConfig
): Promise<any> {
  const { ethereum }: any = window;

  if (!ethereum) {
    throw new Error("Metamask extension is not available");
  }

  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();

  return Promise.resolve({
    getAccounts: function () {
      return [{ address: getInjectiveAddress(signer.address) }]
    }
  });
}

const useMetamask = () => {
  const { init, initialized, clear, clientType, walletLoading, network } = useWallet();
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
        console.log(err)
      });
  }

  const disconnect = () => {
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("selectedWalletType");
    clear();
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

export default useMetamask;