"use client"

import GradientButton from '@/components/Buttons/GradientButton'
import Checkbox from '@/components/Checkbox'
import CookieAccept from '@/components/CookieAccept/CookieAccept'
import Loading from '@/components/Loading/Loading'
import { Modal } from '@/components/Modal/Modal'
import Text from '@/components/Texts/Text'
import { usePathname } from 'next/navigation'
import React, { FC, PropsWithChildren, useEffect, useState } from 'react'

const DisclaimerController: FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const acceptTerms = () => {
        localStorage.setItem(`${window.location.host}-aeroscraper-disclaimer-accepted`, "true");
        setShowDisclaimer(false);
    }

    useEffect(() => {
        const isAppPath = pathname.includes('app');
        const disclaimerAccepted = localStorage.getItem(`${window.location.host}-aeroscraper-disclaimer-accepted`) === "true";

        setShowDisclaimer(isAppPath && !disclaimerAccepted);
    }, [pathname])

    return (
        <>
            {children}
            <Modal
                title='Aeroscraper Protocol Disclaimer'
                showModal={showDisclaimer}
                onClose={() => { setShowDisclaimer(false) }}
                modalSize='lg'
                hideCloseButton
                disableOverlayClose
            >
                <div className='flex flex-col md:px-8 md:py-10 px-4 py-6 overflow-auto' style={{ height: '80vh' }}>
                    <Text size='2xl'>
                        Aeroscraper Protocol Disclaimer
                    </Text>
                    <Text size='lg' className='mt-6'>
                        Introduction
                    </Text>
                    <Text size='base' className='mt-4'>
                        Please read this Disclaimer carefully before accessing, interacting with, or using the Aeroscraper software, which includes the Aeroscraper technology stack (particularly its smart contracts) and any other Aeroscraper technologies, such as the launch kit for frontend operators (collectively referred to as the “Aeroscraper Software”).
                    </Text>
                    <Text size='base' className='mt-4'>
                        This disclaimer pertains to the use of the Aeroscraper Software. The Aeroscraper Software enables users (“Users”) to create interest-free liquidity in AUSD (a USD-pegged stablecoin) by depositing cryptocurrency into autonomous smart contracts on the Injective, Sei, and XION networks. The AUSD is stabilized through a liquidation mechanism and a Stability Pool, both of which are fully decentralized and based on smart contracts. The functionalities of the Aeroscraper Software are purely technical, with no claims towards any private individuals or legal entities.
                    </Text>

                    <Text size='lg' className='mt-6'>
                        No Relationship to Aeroscraper as a Company / Usage of Aeroscraper Software at Own Risk
                    </Text>
                    <Text size='base' className='mt-4'>
                        Aeroscraper operates as a decentralized application and is not structured as a traditional company. It is not responsible for the operation, running, or functioning of the Aeroscraper Software or for any interactions, collaborations, or factual relationships between Users and the smart contracts of the Aeroscraper Software. Aeroscraper has no access to nor can it control or influence the transactions, deposits, and/or allocations made by Users and the involved smart contracts using the Aeroscraper Software. Aeroscraper has not and will not enter into any legal or factual relationship with any User of the Aeroscraper Software. Consequently, AEROSCRAPER IS NOT LIABLE FOR ANY DAMAGES, INCLUDING GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE AEROSCRAPER SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF CRYPTOCURRENCY, AUSD, LOSS OF DATA, BUSINESS INTERRUPTION, OR LOSSES SUSTAINED BY A USER OR THIRD PARTIES RELATED TO THE AEROSCRAPER SOFTWARE).
                    </Text>
                    <Text size='base' className='mt-4'>
                        Given the experimental nature of the Aeroscraper Software, it may contain bugs, defects, or errors that could materially and adversely affect its use, functionality, or performance.
                    </Text>
                    <Text size='base' className='mt-4'>
                        THE AEROSCRAPER SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. THE AEROSCRAPER SOFTWARE IS HIGHLY EXPERIMENTAL, AND ANY CRYPTOCURRENCY AND/OR AUSD SENT, STAKED, OR DEPOSITED IS AT RISK OF BEING LOST INDEFINITELY WITHOUT ANY CONSIDERATION.
                    </Text>
                    <Text size='base' className='mt-4'>
                        Users are solely responsible for the security of their wallet, vault, or other storage mechanisms used to receive and hold cryptocurrency and AUSD, including any necessary private keys or other access credentials. Loss of access credentials may result in the permanent loss of Tokens.
                    </Text>

                    <Text size='lg' className='mt-6'>
                        Assumption of Risks of Cryptographic Tokens, Currencies, and Systems
                    </Text>
                    <Text size='base' className='mt-4'>
                        The purchasing, owning, and using of cryptographic Tokens involve risks. Tokens are highly volatile due to factors such as adoption, speculation, technology, and security risks. The cost of transactions on the Injective, Sei, and XION networks is variable and may increase, affecting activities on these networks.
                    </Text>

                    <Text size='lg' className='mt-6'>
                        Risk of Regulatory Actions and Compliance with Laws
                    </Text>
                    <Text size='base' className='mt-4'>
                        The Aeroscraper Software could be affected by regulatory inquiries or actions, which could limit the ability to access or use the Aeroscraper Software. Users are solely responsible for complying with all applicable laws in their interactions with the Aeroscraper Software
                    </Text>

                    <Checkbox
                        label='I agree'
                        labelClassName='text-lg'
                        checked={isAgreed}
                        onChange={() => setIsAgreed(!isAgreed)}
                        className='mt-10'
                    />
                    {
                        isAgreed &&
                        <GradientButton
                            className='w-full h-10 mt-10 mx-auto'
                            onClick={acceptTerms}
                            rounded='rounded-lg'
                            style={{
                                maxWidth: 375
                            }}
                        >
                            Continue
                        </GradientButton>
                    }
                </div>
            </Modal>
            <CookieAccept hide={showDisclaimer} />
        </>
    )
}

export default DisclaimerController