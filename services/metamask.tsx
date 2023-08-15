import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

declare global {
  interface Window { ethereum: any; }
}

const useMetamask = () => {
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            setWalletAddress('');
          }
        });
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, []);

  const connect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    }
  };

  const disconnect = () => {
    window.ethereum?.removeAllListeners();
    setWalletAddress('');
  };

  return { walletAddress, connect, disconnect };
};

export default useMetamask;