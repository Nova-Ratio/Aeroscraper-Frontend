import React, { PropsWithChildren } from 'react'

type Props = {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    rounded?: string;
} & React.ButtonHTMLAttributes<Element>

const GradientButton: React.FC<PropsWithChildren<Props>> = ({
    className = '',
    rounded = 'rounded-3xl',
    startIcon,
    endIcon,
    children,
    ...rest
}
) => {
    return (
        <button
            className={`${className} main-gradient flex justify-between gap-2 items-center py-5 ${rounded} active:scale-95 transition-all`}
            {...rest}
        >
            {startIcon}
            <div className='flex-1 text-ghost-white'>{children}</div>
            {endIcon}
        </button>
    )
}

export default GradientButton