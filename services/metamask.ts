import { getConfig } from '@/config/network';
import { useWallet } from '@/contexts/WalletProvider'
import { WalletType } from '@/enums/WalletType';
import { BaseAccount, ChainRestAuthApi, getInjectiveAddress } from '@injectivelabs/sdk-ts';
import { useEffect, useMemo, useState } from 'react'

export type SigningMetamaskClient = {}

const useMetamask = () => {
  const { initMetamask, initialized, clear, clientType, network } = useWallet();
  const [initializing, setInitializing] = useState(false);
  const config = getConfig(network, clientType);

  const connect = async () => {
    let anyWindow: any = window;

    if (!clientType) return

    try {
      const addresses = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' });
      const injectiveAddresses = addresses.map(getInjectiveAddress);

      const chainRestAuthApi = new ChainRestAuthApi(config.httpUrl ?? "")
      const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
        injectiveAddresses
      )
      const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
      const accountDetails = baseAccount.toAccountDetails();
      
      console.log(accountDetails);

      initMetamask(injectiveAddresses, WalletType.METAMASK);
    }
    catch (err) {

    }
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