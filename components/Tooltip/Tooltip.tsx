"use client"

import React, { FC, PropsWithChildren, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const PLACEMENT_CLASSES = {
    "bottom": "top-full left-1/2 -translate-x-1/2 translate-y-4",
    "bottom-center": "top-full left-1/2 translate-x-[20%] translate-y-4",
    "top": "bottom-full left-1/2 -translate-x-1/2 -translate-y-4",
    "left": "top-1/2 right-full -translate-x-4 -translate-y-1/2",
    "right": "top-1/2 left-full translate-x-4 -translate-y-1/2",
    "special": "top-full left-full translate-x-4 translate-4",
    "right-top": "top-0 left-full translate-x-4",
    "right-bottom": "bottom-0 left-full translate-x-4",
    "left-top": "top-0 right-full -translate-x-4",
    "left-bottom": "bottom-0 right-full -translate-x-4"
}

type Props = {
    title?: React.ReactNode
    active?: boolean
    placement?: keyof typeof PLACEMENT_CLASSES,
    onHover?: () => void
    onLeave?: () => void
    forceOpen?: boolean
    titleContainerClassName?: string
    titleRootClassName?: string,
    containerClassName?: string,
    width?: string
    height?: string
    rounded?: string
}

const Tooltip: FC<PropsWithChildren<Props>> = ({
    title,
    active = true,
    forceOpen = false,
    placement = "bottom",
    titleContainerClassName = '',
    titleRootClassName = '',
    containerClassName = '',
    onHover,
    onLeave,
    children,
    width = 'w-[300px]',
    rounded = 'rounded-lg'
}) => {
    const [hovered, setHovered] = useState(false)

    const showTooltip = () => {
        setHovered(true)
        onHover?.()
    }

    const closeTooltip = () => {
        setHovered(false)
        onLeave?.()
    }

    return (
        <div className={`relative ${containerClassName}`} onMouseEnter={showTooltip} onMouseLeave={closeTooltip}>
            {children}
            <AnimatePresence>
                {
                    active && (hovered || forceOpen) ?
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', zIndex: 100 }}
                            className={`${PLACEMENT_CLASSES[placement]} ${titleRootClassName}`}
                        >
                            <div className={`${width} ${rounded} ${titleContainerClassName} bg-raisin-black p-2`}>
                                {title}
                            </div>
                        </motion.div>
                        :
                        null
                }
            </AnimatePresence>
        </div>
    )
}

export default Tooltip