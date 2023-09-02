'use client'

import React, { useMemo, useState, useContext, useCallback } from "react";

export const TransactionContext = React.createContext();

const { ethereum } = window;

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = useCallback( async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  },[]);

  const value = useMemo(() => ({ currentAccount, connectWallet }), [currentAccount, connectWallet])

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);