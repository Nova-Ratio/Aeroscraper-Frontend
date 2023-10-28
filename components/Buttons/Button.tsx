import React, { FC } from 'react'
import Loading from '../Loading/Loading';

type ButtonProps = {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
} & React.ButtonHTMLAttributes<Element>

const Button: FC<ButtonProps> = ({
  className = '',
  children,
  loading,
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <button
      disabled={loading}
      className={`${className} rounded border border-white/10 px-6 py-2 gap-2 flex items-center hover:gradient-background mx-auto`}
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

export default Button