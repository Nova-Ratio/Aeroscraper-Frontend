"use client"

import React, { FC, useRef, useState } from 'react'
import GradientButton from '@/components/Buttons/GradientButton'
import { useWallet } from '@/contexts/WalletProvider'
import { useKeplr } from '@/services/keplr'
import Text from '@/components/Texts/Text'
import { WalletInfoMap, WalletType } from '@/enums/WalletType'
import { AnimatePresence, motion } from 'framer-motion'
import BorderedContainer from '../Containers/BorderedContainer'
import useOutsideHandler from '@/hooks/useOutsideHandler'
import { useCompass } from '@/services/compass'
import { useFin } from '@/services/fin'
import { useLeap } from '@/services/leap'
import Loading from '../Loading/Loading'
import { Modal } from '../Modal/Modal'
import AccountModal from '../AccountModal/AccountModal'

type Props = {
    className?: string;
}

const WalletButton: FC<Props> = ({ className = "w-[268px] h-[69px]" }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [walletSelectionOpen, setWalletSelectionOpen] = useState(false);

    const leap = useLeap();
    const keplr = useKeplr();
    const fin = useFin();
    const compass = useCompass();
    const wallet = useWallet();

    const [accountModal, setAccountModal] = useState(false);

    const connectWallet = (walletType: WalletType) => {
        const anyWindow: any = window;

        if (walletType === WalletType.KEPLR) {
            if (!anyWindow.keplr?.getOfflineSigner) { return window.open("https://www.keplr.app/", '_blank', 'noopener,noreferrer'); }

            keplr.connect();
        }
        else if (walletType === WalletType.LEAP) {
            if (!anyWindow.leap?.getOfflineSigner) { return window.open("https://www.leapwallet.io/", '_blank', 'noopener,noreferrer'); }

            leap.connect();
        }
        else if (walletType === WalletType.FIN) {
            if (!anyWindow.fin?.getOfflineSigner) { return window.open("https://chrome.google.com/webstore/detail/fin-wallet-for-sei/dbgnhckhnppddckangcjbkjnlddbjkna", '_blank', 'noopener,noreferrer'); }
            fin.connect();
        }
        else if (walletType === WalletType.COMPASS) {
            if (!anyWindow.compass.getOfflineSigner) { return window.open("https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb", '_blank', 'noopener,noreferrer'); }

            compass.connect();
        }

        setWalletSelectionOpen(false);
    }

    const openAccountModal = () => {
        setAccountModal(true);
    }

    const toggleWallet = () => {
        if (wallet.initialized) {
            openAccountModal();
        }
        else {
            setWalletSelectionOpen(prev => !prev);
        }
    }

    const closeWalletSelection = () => {
        setWalletSelectionOpen(false);
    }
    console.log(accountModal);

    useOutsideHandler(ref, closeWalletSelection);

    if (wallet.initialized) {
        return (
            <>
                <div className='w-fit h-fit cursor-pointer active:scale-95 transition-all z-[50]' onClick={openAccountModal}>
                    <BorderedContainer className={`${className} flex items-center justify-center space-x-4 p-4`}>
                        <motion.img layoutId="profile"  alt={wallet.walletType} className='w-8 h-8 object-contain' src={WalletInfoMap[wallet.walletType ?? WalletType.NOT_SELECTED].thumbnailURL} />
                        <div className='w-[85%] flex flex-col'>
                            <Text size='base' weight='font-semibold' className='truncate'>{wallet.name}</Text>
                            <Text size='sm' className='truncate'>{wallet.address}</Text>
                        </div>
                    </BorderedContainer>
                </div>
                <AccountModal showModal={accountModal} onClose={() => { setAccountModal(false); }} />
            </>
        )
    }

    return (
        <div className='relative' ref={ref}>
            <GradientButton className={className} onClick={toggleWallet}>
                {wallet.walletLoading ? <Loading width={36} height={36} /> : <Text>Connect Wallet</Text>}
            </GradientButton>
            <Modal modalSize='sm' title='Connect Wallet' showModal={walletSelectionOpen}>
                <div ref={ref} className='space-y-2 mt-10 mx-10'>
                    <GradientButton rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { connectWallet(WalletType.LEAP); }}>
                        <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                            <img alt="leap" src='/images/leap-dark.svg' />
                        </div>
                    </GradientButton>
                    <GradientButton rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { connectWallet(WalletType.COMPASS); }}>
                        <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                            <img alt="compass" src='/images/compass.png' />
                        </div>
                    </GradientButton>
                    <GradientButton rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { connectWallet(WalletType.FIN); }}>
                        <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                            <img alt="fin" src='/images/fin.png' />
                        </div>
                    </GradientButton>
                    <GradientButton rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { connectWallet(WalletType.KEPLR); }}>
                        <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                            <img alt="keplr" src='/images/keplr-dark.svg' />
                        </div>
                    </GradientButton>
                </div>
            </Modal>
        </div>
    )
}

export default WalletButton