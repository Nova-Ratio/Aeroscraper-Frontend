import React, { PropsWithChildren } from 'react'
import Loading from '../Loading/Loading';

type Props = {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    rounded?: string;
    loading?: boolean
} & React.ButtonHTMLAttributes<Element>

const GradientButton: React.FC<PropsWithChildren<Props>> = ({
    className = '',
    rounded = 'rounded-3xl',
    startIcon,
    endIcon,
    loading = false,
    children,
    ...rest
}
) => {
    return (
        <button
            disabled={loading}
            className={`py-5 ${className} main-gradient flex justify-between gap-2 items-center ${rounded} active:scale-95 transition-all`}
            {...rest}
        >
            {startIcon}
            <div className='flex-1 text-ghost-white'>
                {loading ?
                    <Loading width={28} height={28} />
                    : children
                }
            </div>
            {endIcon}
        </button>
    )
}

export default GradientButton