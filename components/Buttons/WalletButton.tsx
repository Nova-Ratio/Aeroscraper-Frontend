"use client"

import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import GradientButton from '@/components/Buttons/GradientButton'
import { useWallet } from '@/contexts/WalletProvider'
import Text from '@/components/Texts/Text'
import { motion } from 'framer-motion'
import useOutsideHandler from '@/hooks/useOutsideHandler'
import Loading from '../Loading/Loading'
import AccountModal from '../AccountModal/AccountModal'
import { NumericFormat } from 'react-number-format'
import { WalletsByChainName } from '@/constants/walletConstants'
import { isNil } from 'lodash'
import { Modal } from '../Modal/Modal'
import Button from './Button'
import { capitalizeFirstLetter } from '@/utils/stringUtils'
import TransactionButton from './TransactionButton'
import useChainAdapter from '@/hooks/useChainAdapter'
import { chains } from 'chain-registry'
import { ChainName } from '@/enums/Chain'
import { MissingChainImageByName } from '@/constants/chainConstants'
import { WalletTypeV2 } from '@/enums/WalletTypeV2'

const availableChains = Object.values(chains).filter(chain => Object.values(ChainName).includes(chain.chain_name as ChainName));

type Props = {
    ausdBalance?: number;
    baseCoinBalance?: number;
    className?: string;
    basePrice?: number;
}

const WalletButton: FC<Props> = ({ ausdBalance = 0, baseCoinBalance = 0, basePrice = 0, className = "w-[268px] h-[69px]" }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [walletSelectionOpen, setWalletSelectionOpen] = useState(false);
    const { baseCoin } = useWallet();
    const {
        selectedChainName,
        setSelectedChainName,
        chain,
        walletRepo,
        isWalletConnected,
        isWalletConnecting,
        wallet,
        address
    } = useChainAdapter();

    const [accountModal, setAccountModal] = useState(false);

    const [walletExtensions, setWalletExtensions] = useState<{ installed: { name: WalletTypeV2 }[], otherWallets: { name: WalletTypeV2, downloadLink: string }[] } | undefined>();
    const [showDownloadExtension, setShowDownloadExtension] = useState<{ name: WalletTypeV2, downloadLink: string } | undefined>();

    const [onHoverChain, setOnHoverChain] = useState<ChainName | null>();

    const filteredWallets = useMemo(() => walletRepo.wallets
        .filter(wallet => selectedChainName && WalletsByChainName[selectedChainName].includes(wallet.walletInfo.name as WalletTypeV2)),
        [walletRepo, selectedChainName])

    const hoveredChainWallets = useMemo(() => walletRepo.wallets
        .filter(wallet => onHoverChain && WalletsByChainName[onHoverChain].includes(wallet.walletInfo.name as WalletTypeV2))
        , [onHoverChain, walletRepo])

    const {
        installedWallets,
        otherWallets
    } = useMemo(() => ({
        installedWallets: filteredWallets.filter(item => walletExtensions?.installed.some(extension => extension.name === item.walletInfo.name)),
        otherWallets: filteredWallets.filter(item => walletExtensions?.otherWallets.some(extension => extension.name === item.walletInfo.name))
    }), [filteredWallets, walletExtensions])

    const {
        installedHoveredWallets,
        otherHoveredWallets
    } = useMemo(() => ({
        installedHoveredWallets: hoveredChainWallets.filter(item => walletExtensions?.installed.some(extension => extension.name === item.walletInfo.name)),
        otherHoveredWallets: hoveredChainWallets.filter(item => walletExtensions?.otherWallets.some(extension => extension.name === item.walletInfo.name))
    }), [hoveredChainWallets, walletExtensions])

    useEffect(() => {
        checkWalletExtensions();
    }, []);

    const checkWalletExtensions = () => {
        const anyWindow: any = window;

        const walletExtensions: { installed: { name: WalletTypeV2 }[], otherWallets: { name: WalletTypeV2, downloadLink: string }[] } = { installed: [], otherWallets: [] };

        anyWindow.keplr?.getOfflineSigner ? walletExtensions.installed.push({ name: WalletTypeV2.KEPLR }) : walletExtensions.otherWallets.push({ name: WalletTypeV2.KEPLR, downloadLink: "https://www.keplr.app/" });
        anyWindow.leap?.getOfflineSigner ? walletExtensions.installed.push({ name: WalletTypeV2.LEAP }) : walletExtensions.otherWallets.push({ name: WalletTypeV2.LEAP, downloadLink: "https://www.leapwallet.io/" });
        // anyWindow.fin?.getOfflineSigner ? walletExtensions.installed.push({ name: WalletType.FIN }) : walletExtensions.otherWallets.push({ name: WalletType.FIN, downloadLink: "https://chrome.google.com/webstore/detail/fin-wallet-for-sei/dbgnhckhnppddckangcjbkjnlddbjkna" });
        // anyWindow.compass?.getOfflineSigner ? walletExtensions.installed.push({ name: WalletType.COMPASS }) : walletExtensions.otherWallets.push({ name: WalletType.COMPASS, downloadLink: "https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb" });
        anyWindow.ethereum ? walletExtensions.installed.push({ name: WalletTypeV2.METAMASK }) : walletExtensions.otherWallets.push({ name: WalletTypeV2.METAMASK, downloadLink: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1" });
        anyWindow.ninji ? walletExtensions.installed.push({ name: WalletTypeV2.NINJI }) : walletExtensions.otherWallets.push({ name: WalletTypeV2.NINJI, downloadLink: "https://chromewebstore.google.com/detail/ninji-wallet/kkpllbgjhchghjapjbinnoddmciocphm" });

        setWalletExtensions(walletExtensions);
    }

    const openAccountModal = () => {
        setAccountModal(true);
    }

    const toggleWallet = () => {
        if (isWalletConnected) {
            openAccountModal();
        }
        else {
            setWalletSelectionOpen(prev => !prev);
        }
    }

    const closeWalletSelection = () => {
        setWalletSelectionOpen(false);
        setShowDownloadExtension(undefined);
        if (!isWalletConnected) {
            //Reset client type selection
            setSelectedChainName(undefined);
        }
    }

    const resetChain = () => {
        setSelectedChainName(undefined);
    }

    useOutsideHandler(ref, closeWalletSelection);

    if (isWalletConnected) {
        return (
            <>
                <div className='w-fit h-fit cursor-pointer active:scale-95 transition-all z-[50] flex items-center gap-4' onClick={openAccountModal}>
                    <div className="secondary-gradient w-[72px] h-[72px] p-0.5 rounded flex justify-between items-center gap-2 cursor-pointer">
                        <img
                            alt="user-profile-image"
                            // src={wallet.profileDetail?.photoUrl ?? "/images/profile-images/profile-i-1.jpg"}
                            src={"/images/profile-images/profile-i-1.jpg"}
                            className='w-full h-full rounded-sm bg-raisin-black'
                        />
                        <motion.div layoutId="profile" />
                    </div>
                    <div className='max-w-[300px]'>
                        <div className='flex gap-4  items-center'>
                            <img alt={wallet?.name} className='w-8 h-8 object-contain' src={wallet?.logo as string} />
                            <div className='w-[75%] flex flex-col'>
                                <Text size='base' weight='font-semibold' className='truncate'>{wallet?.prettyName}</Text>
                                <Text size='sm' className='truncate'>{address}</Text>
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
                            <img alt={baseCoin?.name} className="w-6 h-6 ml-4" src={baseCoin?.tokenImage} />
                            <NumericFormat
                                value={baseCoinBalance}
                                thousandsGroupStyle="thousand"
                                thousandSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                renderText={(value) =>
                                    <Text size='base' className='flex ml-2 gap-2'>
                                        {baseCoin?.name}: {value}
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
                {isWalletConnecting ? <Loading width={36} height={36} /> : <Text size='base'>Select Chain & Connect Wallet</Text>}
            </GradientButton>
            <Modal modalSize='lg' showModal={walletSelectionOpen}>
                <div ref={ref} className='md:flex md:h-[644px]'>
                    <div className='pt-10 pl-8 w-[300px] md:border-r border-white/10 relative'>
                        <h2 className='text-[#F7F7FF] text-2xl font-medium'>{!isNil(selectedChainName) ? "Connect Wallet" : "Select Chain"}</h2>
                        {!isNil(selectedChainName) &&
                            <div className={`gap-y-4 flex flex-col mt-10 ${isNil(selectedChainName) ? "hidden" : ""}`}>
                                {
                                    installedWallets.map((wallet, idx) => {
                                        return <div key={idx} className={`mr-auto ${wallet.walletInfo.name === WalletTypeV2.LEAP ? "" : "md:inline-block hidden"}`} >
                                            {idx === 0 && <Text size='base' className='mb-4'>Installed Wallets</Text>}
                                            <Button
                                                onClick={() => wallet.connect()}
                                                startIcon={<img className='w-6 h-6 object-contain' alt={wallet.walletInfo.name} src={wallet.walletInfo.logo as string} />}
                                            >
                                                <span className='text-[18px] font-medium text-ghost-white'>{capitalizeFirstLetter(wallet.walletPrettyName)}</span>
                                            </Button>
                                        </div>
                                    })
                                }
                                {
                                    otherWallets.map((wallet, idx) => (
                                        <div key={idx} className={`mr-auto ${wallet.walletInfo.name === WalletTypeV2.LEAP ? "" : "md:inline-block hidden"}`}>
                                            {idx === 0 && <Text size='base' className='mb-4'>Other Wallets</Text>}
                                            <Button
                                                onClick={() => { setShowDownloadExtension({ name: wallet.walletPrettyName as WalletTypeV2, downloadLink: walletExtensions?.otherWallets.find(i => i.name === wallet.walletInfo.name)?.downloadLink! }); }}
                                                startIcon={<img className='w-6 h-6 object-contain' alt={wallet.walletInfo.name} src={wallet.walletInfo.logo as string} />}
                                            >
                                                <span className='text-[18px] font-medium text-ghost-white'>{capitalizeFirstLetter(wallet.walletPrettyName)}</span>
                                            </Button>
                                        </div>
                                    ))
                                }
                            </div>}
                        {isNil(selectedChainName) &&
                            <div className={`gap-y-4 flex-col mt-10 md:flex hidden`}>
                                {
                                    installedHoveredWallets.map((wallet, idx) => {
                                        return (
                                            <motion.div
                                                key={idx}
                                                className={`inline-block mr-auto duration-300 transition-all`}
                                                initial={{ opacity: 0.0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 1 }}
                                            >
                                                {idx === 0 && <Text size='base' className='mb-4'>Installed Wallets</Text>}
                                                <Button
                                                    disabled
                                                    onClick={() => { wallet.connect() }}
                                                    startIcon={<img className='w-6 h-6 object-contain' alt={wallet.walletInfo.name} src={wallet.walletInfo.logo as string} />}
                                                >
                                                    <span className='text-[18px] font-medium text-ghost-white'>{capitalizeFirstLetter(wallet.walletPrettyName)}</span>
                                                </Button>
                                            </motion.div>
                                        )
                                    })
                                }
                                {
                                    otherHoveredWallets.map((wallet, idx) => {
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0.0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 1 }}
                                                className={`inline-block mr-auto`}
                                            >
                                                {idx === 0 && <Text size='base' className='mb-4'>Other Wallets</Text>}
                                                <Button
                                                    disabled
                                                    onClick={() => { setShowDownloadExtension({ name: wallet.walletPrettyName as WalletTypeV2, downloadLink: walletExtensions?.otherWallets.find(i => i.name === wallet.walletInfo.name)?.downloadLink! }); }}
                                                    startIcon={<img className='w-6 h-6 object-contain' alt={wallet.walletInfo.name} src={wallet.walletInfo.logo as string} />}
                                                >
                                                    <span className='text-[18px] font-medium text-ghost-white'>{capitalizeFirstLetter(wallet.walletPrettyName)}</span>
                                                </Button>
                                            </motion.div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className={`flex-1 flex flex-col items-center justify-center text-center md:border-t-0 border-t border-white/20 mt-8 pt-8 md:pt-0`}>
                        {showDownloadExtension &&
                            <motion.div
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: 1 }}
                                className="mx-[140px]"
                            >
                                <img className='w-[112px] h-[112px] object-contain mx-auto mb-14' alt={showDownloadExtension.name} src={''} />
                                <Text size='4xl' textColor='text-white' className='mb-10'>{capitalizeFirstLetter(showDownloadExtension.name)} is not installed</Text>
                                <Text size='base' textColor='text-[#989396]'>If {capitalizeFirstLetter(showDownloadExtension.name)} installed on your device, please refresh this page or follow the browser instructions.</Text>
                                <TransactionButton
                                    className="w-[375px] h-11 mt-10 mx-auto"
                                    onClick={() => { window.open(showDownloadExtension.downloadLink, '_blank', 'noopener,noreferrer'); }}
                                    text={`Install ${capitalizeFirstLetter(showDownloadExtension.name)}`}
                                />
                            </motion.div>
                        }
                        {!showDownloadExtension && (
                            !isNil(selectedChainName) ?
                                (<motion.div
                                    initial={{ opacity: 0.1 }}
                                    animate={{ opacity: 1 }}
                                    className="mx-10 md:mx-[140px]"
                                >
                                    <Text size='4xl' textColor='text-white' className='mb-4 md:mb-10 mt-4'>How do I connect my wallet?</Text>
                                    <div className='flex justify-center items-center gap-16 mb-8'>
                                        {
                                            filteredWallets.map((wallet, idx) => {
                                                return <img alt={wallet.walletInfo.name} key={idx} className={`w-6 h-6 object-contain ${wallet.walletInfo.name === WalletTypeV2.LEAP ? "" : "md:inline-block hidden"}`} src={wallet.walletInfo.logo as string} />
                                            })
                                        }
                                    </div>
                                    <Text size='base' textColor='text-[#989396]'>If you want to connect an installed wallet, you can log in by selecting your wallet under &quot;Installed Wallets&quot; on the left side of the screen and using the browser extension.</Text>
                                    <Text size='base' textColor='text-[#989396]' className='mt-2 md:mt-10'>If you do not have an installed wallet, you can choose one of the wallet options on the left side of the screen and follow the instructions to set up your wallet.</Text>
                                </motion.div>
                                )
                                :
                                (<div className='p-10 mt-10 md:mt-0'>
                                    <p className='text-base font-medium text-[#989396]'>Before you start,</p>
                                    <h3 className='text-white text-3xl font-medium'>Please choose your chain</h3>
                                    <div className='space-y-6 mt-10'>
                                        {
                                            isNil(selectedChainName) && availableChains.map((chain, idx) => {
                                                return <Button
                                                    key={idx}
                                                    onClick={() => { setSelectedChainName(chain.chain_name as ChainName) }}
                                                    onMouseEnter={() => setOnHoverChain(chain.chain_name as ChainName)}
                                                    onMouseLeave={() => setOnHoverChain(null)}
                                                    startIcon={<img alt={chain.chain_name} src={chain.logo_URIs?.png ?? MissingChainImageByName[chain.chain_name]} className='w-8 h-8' />}
                                                >
                                                    <span className='text-[18px] font-medium text-ghost-white uppercase'>{chain.pretty_name}</span>
                                                </Button>
                                            })
                                        }
                                    </div>
                                </div>)
                        )}
                    </div>
                    {selectedChainName && (
                        <div className='flex gap-4 items-center mt-auto absolute bottom-8 left-8'>
                            <Text size='base'>Chain</Text>
                            <Button
                                onClick={resetChain}
                                startIcon={<img alt={chain.pretty_name} src={chain.logo_URIs?.png ?? MissingChainImageByName[chain.chain_name]} className='w-6 h-6' />}
                            >
                                {capitalizeFirstLetter(chain.pretty_name.toLocaleLowerCase())}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal >
        </div >
    )
}

export default WalletButton