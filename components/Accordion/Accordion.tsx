"use client"

import React, { FC, PropsWithChildren, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import useOutsideHandler from '../../hooks/useOutsideHandler';
import Text from '../Texts/Text';

export type AccordionRef = {
    closeAccordion: () => void
}

//TODO: Add props named context which is a function that returns a React.ReactNode and takes a parameter named isExpanded
type Props = {
    containerClassName?: string,
    buttonClassName?: string,
    className?: string,
    textClassName?: string,
    responsiveText?: boolean,
    text?: string,
    renderDefault?: React.ReactNode,
    placement?: "bottom" | "top",
}

const Placement = {
    "bottom": "absolute left-0 bottom-1 translate-y-full",
    "top": "absolute left-0 top-1 -translate-y-full"
}

const Accordion = React.forwardRef(({ children, containerClassName, buttonClassName, className, text, textClassName, responsiveText = true, placement = "bottom", renderDefault }: PropsWithChildren<Props>, externalRef) => {
    const ref = useRef(null);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    }

    const closeExpanded = () => {
        setIsExpanded(false);
    }

    useOutsideHandler(ref, closeExpanded);

    useImperativeHandle(externalRef, (): AccordionRef => ({ closeAccordion: closeExpanded }))

    return (
        <div ref={ref} className={`relative w-full h-full rounded-lg bg-dark-purple flex flex-col ${isExpanded ? placement === "bottom" ? 'rounded-b-none' : 'rounded-t-none' : ''}`}>
            <button className={`${buttonClassName ?? ''} w-full h-16 flex justify-between items-center bg-transparent px-4`} onClick={toggleExpanded}>
                {
                    renderDefault ?? <Text size='xl' className={textClassName} responsive={responsiveText}>{text}</Text>
                }
                <img alt='expand' src="/images/arrow-down.svg" className={`${isExpanded ? 'rotate-180' : 'rotate-0'} transition`} />
            </button>
            <AnimatePresence>
                {
                    isExpanded &&
                    <motion.div
                        className={`${className} w-full h-fit ${Placement[placement]} overflow-auto scrollbar-hidden border-0 z-[900]`}
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                    >
                        <div className={`w-full h-fit bg-dark-purple ${placement === "bottom" ? "rounded-b-lg" : "rounded-t-lg"}`}>
                            {children}
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}
)
Accordion.displayName = "Accordion"
export default Accordion