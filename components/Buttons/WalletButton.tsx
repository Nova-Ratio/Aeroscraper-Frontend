"use client"

import React, { FC, useRef, useState } from 'react'
import GradientButton from '@/components/Buttons/GradientButton'
import { useWallet } from '@/contexts/WalletProvider'
import { useKeplr } from '@/services/keplr'
import Text from '@/components/Texts/Text'
import { WalletInfoMap, WalletType } from '@/enums/WalletType'
import { motion } from 'framer-motion'
import useOutsideHandler from '@/hooks/useOutsideHandler'
import { useCompass } from '@/services/compass'
import { useFin } from '@/services/fin'
import { useLeap } from '@/services/leap'
import Loading from '../Loading/Loading'
import AccountModal from '../AccountModal/AccountModal'
import { NumericFormat } from 'react-number-format'
import { BaseCoinByClient, ClientImagesByName, WalletByClient, WalletImagesByName } from '@/constants/walletConstants'
import { isNil } from 'lodash'
import { ClientEnum } from '@/types/types'
import { Modal } from '../Modal/Modal'
import { LogoSecondary } from '../Icons/Icons'
import Button from './Button'

type Props = {
    ausdBalance?: number;
    baseCoinBalance?: number;
    className?: string;
    basePrice?: number;
}

const WalletButton: FC<Props> = ({ ausdBalance = 0, baseCoinBalance = 0, basePrice = 0, className = "w-[268px] h-[69px]" }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [walletSelectionOpen, setWalletSelectionOpen] = useState(false);
    const { clientType, baseCoin, selectClientType } = useWallet();

    const leap = useLeap();
    const keplr = useKeplr();
    const fin = useFin();
    const compass = useCompass();
    const wallet = useWallet();

    const [accountModal, setAccountModal] = useState(false);

    const selectClient = (value: ClientEnum) => {
        selectClientType(value)
    }

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
        if (!wallet.initialized) {
            //Reset client type selection
            selectClientType(undefined);
        }
    }

    useOutsideHandler(ref, closeWalletSelection);

    if (wallet.initialized && !isNil(baseCoin)) {
        return (
            <>
                <div className='w-fit h-fit cursor-pointer active:scale-95 transition-all z-[50] flex items-center gap-4' onClick={openAccountModal}>
                    <div className="secondary-gradient w-[72px] h-[72px] p-0.5 rounded flex justify-between items-center gap-2 cursor-pointer">
                        <img
                            alt="user-profile-image"
                            src={wallet.profileDetail?.photoUrl ?? "/images/profile-images/profile-i-1.jpg"}
                            className='w-full h-full rounded-sm bg-raisin-black'
                        />
                        <motion.div layoutId="profile" />
                    </div>
                    <div className='max-w-[300px]'>
                        <div className='flex gap-4  items-center'>
                            <img alt={wallet.walletType} className='w-8 h-8 object-contain' src={WalletInfoMap[wallet.walletType ?? WalletType.NOT_SELECTED].thumbnailURL} />
                            <div className='w-[75%] flex flex-col'>
                                <Text size='base' weight='font-semibold' className='truncate'>{wallet.name}</Text>
                                <Text size='sm' className='truncate'>{wallet.address}</Text>
                            </div>
                        </div>
                        <div className='flex items-center mt-2'>
                            <img alt="aero" className="w-6 h-6" src="/images/token-images/ausd.svg" />
                            <NumericFormat
                                value={ausdBalance}
                                thousandsGroupStyle="thousand"
                                thousandSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                renderText={(value) =>
                                    <Text size='base' className='flex ml-2 gap-2'>
                                        AUSD: {value}
                                    </Text>
                                }
                            />
                            <img alt="sei" className="w-6 h-6 ml-4" src={baseCoin.image} />
                            <NumericFormat
                                value={baseCoinBalance}
                                thousandsGroupStyle="thousand"
                                thousandSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                renderText={(value) =>
                                    <Text size='base' className='flex ml-2 gap-2'>
                                        {baseCoin.name}: {value}
                                    </Text>
                                }
                            />
                        </div>
                    </div>
                </div>
                <AccountModal
                    balance={{ ausd: ausdBalance, base: baseCoinBalance }}
                    showModal={accountModal}
                    basePrice={basePrice}
                    onClose={() => { setAccountModal(false); }}
                />
            </>
        )
    }

    return (
        <div className='relative'>
            <GradientButton className={className} onClick={toggleWallet}>
                {wallet.walletLoading ? <Loading width={36} height={36} /> : <Text>Connect Wallet</Text>}
            </GradientButton>
            <Modal modalSize='lg' showModal={walletSelectionOpen}>
                <div ref={ref} className='flex h-[644px]'>
                    <div className='pt-10 px-8 border-r border-white/10'>
                        <h2 className='text-[#F7F7FF] text-2xl font-medium'>Connect Wallet</h2>
                        <div className={`space-y-2 mt-10 ${isNil(clientType) ? "opacity-50" : ""}`}>
                            {
                                !isNil(clientType) && WalletByClient[clientType].map((walletType, idx) => (
                                    <Button
                                        key={idx}
                                        onClick={() => { connectWallet(walletType); }}
                                        startIcon={<img alt={walletType} src={WalletImagesByName[walletType].image} />}
                                    >
                                        <span className='text-[18px] font-medium text-ghost-white'>{walletType}</span>
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                    <div className={`flex-1 flex flex-col items-center justify-center text-center rounded-3xl ${!isNil(clientType) ? "bg-black/40 opacity-50" : ""}`}>
                        {!isNil(clientType) ?
                            (<motion.div
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: 1 }}
                            >
                                <LogoSecondary className='w-40 h-40 mb-10 mx-auto' />
                                <p className='text-base font-medium text-[#989396]'>Before you start,</p>
                                <h3 className='text-white text-3xl font-medium'>Please choose your wallet</h3>
                            </motion.div>
                            )
                            :
                            (<>
                                <p className='text-base font-medium text-[#989396]'>Before you start,</p>
                                <h3 className='text-white text-3xl font-medium'>Please choose your chain</h3>
                                <div className='space-y-6 mt-10'>
                                    {
                                        isNil(clientType) && Object.values(ClientEnum).map((clientType, idx) => (
                                            <Button
                                                key={idx}
                                                onClick={() => { selectClient(clientType); }}
                                                startIcon={<img alt={clientType} src={BaseCoinByClient[clientType].image} className='w-8 h-8' />}
                                            >
                                                <span className='text-[18px] font-medium text-ghost-white'>{clientType}</span>
                                            </Button>
                                        ))
                                    }
                                </div>
                            </>)
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default WalletButton

{/* <div ref={ref} className='space-y-2 mt-10 mx-10'>
{
    !isNil(clientType) && WalletByClient[clientType].map((walletType, idx) => (
        <GradientButton key={idx} rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { connectWallet(walletType); }}>
            <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                <img alt={walletType} src={WalletImagesByName[walletType].image} />
            </div>
        </GradientButton>
    ))
}
{
    isNil(clientType) && Object.values(ClientEnum).map((clientType, idx) => (
        <GradientButton key={idx} rounded='rounded-lg' className='w-full h-12 px-[2px]' onClick={() => { selectClient(clientType); }}>
            <div className='w-full h-11 flex justify-center items-center rounded-[6px] bg-dark-purple'>
                <img alt={clientType} src={ClientImagesByName[clientType].image} className='w-full px-10' />
            </div>
        </GradientButton>
    ))
}
</div> */}