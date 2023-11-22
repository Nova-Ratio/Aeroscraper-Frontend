import { useWallet } from '@/contexts/WalletProvider'
import React, { useState } from 'react'

const metamask = () => {
    const [initializing, setInitializing] = useState(false);
    const { initEth } = useWallet();

    const connect = async () => {
        try {
            setInitializing(true);
            const address = await window.ethereum.request({ method: 'eth_requestAccounts' })
            initEth(address);
            setInitializing(false);
        }
        catch (err) {

        }
    }
}

export default metamask