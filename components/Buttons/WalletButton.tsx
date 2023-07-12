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

    const connectWallet = (walletType: WalletType) => {
        if (walletType === WalletType.KEPLR) {
            keplr.connect();
        }
        else if (walletType === WalletType.LEAP) {
            leap.connect();
        }
        else if (walletType === WalletType.FIN) {
            fin.connect();
        }
        else if (walletType === WalletType.COMPASS) {
            compass.connect();
        }

        setWalletSelectionOpen(false);
    }

    const disconnectWallet = () => {
        keplr.disconnect()
        leap.disconnect()
        fin.disconnect()
        compass.disconnect()
    }

    const toggleWallet = () => {
        if (wallet.initialized) {
            //TODO: Open wallet info modal
            disconnectWallet();
        }
        else {
            setWalletSelectionOpen(prev => !prev);
        }
    }

    const closeWalletSelection = () => {
        setWalletSelectionOpen(false);
    }

    useOutsideHandler(ref, closeWalletSelection);

    if (wallet.initialized) {
        return (
            <div className='w-fit h-fit cursor-pointer active:scale-95 transition-all z-[200]' onClick={disconnectWallet}>
                <BorderedContainer className={`${className} flex items-center justify-center space-x-4 p-4`}>
                    <img alt={wallet.walletType} className='w-8 h-8 object-contain' src={WalletInfoMap[wallet.walletType ?? WalletType.NOT_SELECTED].thumbnailURL} />
                    <div className='w-[85%] flex flex-col'>
                        <Text size='base' weight='font-semibold' className='truncate'>{wallet.name}</Text>
                        <Text size='sm' className='truncate'>{wallet.address}</Text>
                    </div>
                </BorderedContainer>
            </div>
        )
    }

    return (
        <div className='relative' ref={ref}>
            <GradientButton className={className} onClick={toggleWallet}>
                {wallet.walletLoading ? <Loading width={36} height={36} /> : <Text>Connect Wallet</Text>}
            </GradientButton>
            <AnimatePresence>
                {
                    walletSelectionOpen &&
                    <motion.div
                        initial={{ transform: 'translateY(75px)', opacity: 0 }}
                        animate={{ transform: 'translateY(90px)', opacity: 1 }}
                        exit={{ transform: 'translateY(75px)', opacity: 0 }}
                        transition={{ bounce: false }}
                        className='absolute left-0 right-0 top-0 z-[200]'
                    >
                        <BorderedContainer className="w-full opacity-100 p-4 space-y-2 text-center">
                            <Text size='2xl'>Connect Wallet</Text>
                            <GradientButton rounded='rounded-lg' className='w-full h-11 px-[2px]' onClick={() => { connectWallet(WalletType.LEAP); }}>
                                <div className='w-full h-10 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                                    <img alt="leap" src='/images/leap-dark.svg' />
                                </div>
                            </GradientButton>
                            <GradientButton rounded='rounded-lg' className='w-full h-11 px-[2px]' onClick={() => { connectWallet(WalletType.COMPASS); }}>
                                <div className='w-full h-10 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                                    <img alt="compass" src='/images/compass.png' />
                                </div>
                            </GradientButton>
                            <GradientButton rounded='rounded-lg' className='w-full h-11 px-[2px]' onClick={() => { connectWallet(WalletType.FIN); }}>
                                <div className='w-full h-10 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                                    <img alt="fin" src='/images/fin.png' />
                                </div>
                            </GradientButton>
                            <GradientButton rounded='rounded-lg' className='w-full h-11 px-[2px]' onClick={() => { connectWallet(WalletType.KEPLR); }}>
                                <div className='w-full h-10 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                                    <img alt="keplr" src='/images/keplr-dark.svg' />
                                </div>
                            </GradientButton>
                        </BorderedContainer>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}

export default WalletButton