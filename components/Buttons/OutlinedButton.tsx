"use client"

import React, { FC, PropsWithChildren } from 'react'

const ROUNDED_VARIANTS = {
    'lg': {
        container: 'rounded-lg',
        inner: 'rounded-[6px]'
    },
    '2xl': {
        container: 'rounded-2xl',
        inner: 'rounded-[14px]'
    }
}

type Props = {
    className?: string,
    containerClassName?: string,
    innerClassName?: string,
    hoverActive?: boolean,
    rounded?: 'lg' | '2xl',
    bgColor?: string
} & React.ButtonHTMLAttributes<Element>

const OutlinedButton: FC<PropsWithChildren<Props>> = ({
    children,
    bgColor = 'licorice',
    className = '',
    containerClassName = '',
    innerClassName = '',
    rounded = 'lg',
    ...rest
}) => {

    return (
        <button {...rest} className={`flex items-center justify-center ${containerClassName} group active:scale-95 transition-all`}>
            <div className={`${className} w-full border-0 main-gradient ${ROUNDED_VARIANTS[rounded].container} text-base font-normal text-white p-[2.5px]`}>
                <div className={`${innerClassName} flex h-full w-full items-center justify-center bg-${bgColor} ${ROUNDED_VARIANTS[rounded].inner} group-hover:opacity-80 transition-all`}>
                    {children}
                </div>
            </div>
        </button>
    )
}

export default OutlinedButton