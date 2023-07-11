import React, { PropsWithChildren } from 'react'

type Props = {
    className?: string,
    style?: React.CSSProperties,
}

const BorderedContainer = React.forwardRef<any, PropsWithChildren<Props>>(({ children, className = '', style }, ref) => {
    return (
        <div ref={ref} className={`${className} rounded-[6px] relative bg-licorice`} style={style}>
            <div className='absolute inset-[-3px] main-gradient rounded-lg -z-[1]' />
            {children}
        </div>
    )
})

BorderedContainer.displayName = "BorderedContainer";

export default BorderedContainer