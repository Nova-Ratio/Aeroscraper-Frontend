"use client"

import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import Text from '../Texts/Text';
import GradientButton from '../Buttons/GradientButton';
import { getCookie, setCookie } from 'react-use-cookie';

type Props = {
    hide?: boolean;
}

const CookieAccept: FC<Props> = ({ hide = false }) => {
    const [open, setOpen] = useState(false);

    const onAccept = () => {
        setCookie('aeroscraper-cookie-accept', 'true');
        setOpen(false);
    }

    useEffect(() => {
        const isCookieAccepted = getCookie('aeroscraper-cookie-accept') === 'true';
        setOpen(!isCookieAccepted);
    }, [])

    return ReactDOM.createPortal((
        <AnimatePresence>
            {
                open && !hide &&
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    className='fixed bottom-0 right-0 left-0 z-[1000]'
                >
                    <div className='w-full rounded-2xl p-[1px] bg-gradient-to-r from-absolute-zero to-[#0BF6CC00]'>
                        <div className='flex md:flex-row flex-col items-center justify-between lg:gap-[246px] md:gap-[150px] gap-10 w-full px-10 py-8 rounded-2xl bg-[#0C0C27]'>
                            <div className='flex flex-col gap-4'>
                                <Text size='xl' className='font-medium leading-[28px]'>
                                    This website uses cookies to enhance the user experience.
                                </Text>
                                <Text size='sm' className='leading-[28px]'>
                                    We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you{"’"}ve provided to them or that they{"’"}ve collected from your use of their services.
                                </Text>
                            </div>
                            <GradientButton
                                containerClassName='md:max-w-[176px] w-full'
                                className='w-full h-9 text-base shrink-0'
                                rounded='rounded-lg'
                                onClick={onAccept}
                            >
                                I understand
                            </GradientButton>
                        </div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    ), document?.body)
}

export default CookieAccept