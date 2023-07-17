import React, { FC, useRef } from 'react'
import { NumericFormat, OnValueChange } from 'react-number-format'

type ExtraProps = {
    containerClassName?: string
    hintContent?: React.ReactNode
    hintAlign?: "left" | "right"
    hintVariant?: 'primary' | 'secondary'
    hintSize?: "xl" | "base"
    onValueChange?: OnValueChange
    value: string | number | null | undefined
}

const HINT_ALIGN = { 'left': 'left-[16px]', 'right': 'right-[16px]' }

const BorderedNumberInput: FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & ExtraProps> = ({
    containerClassName,
    className,
    hintContent,
    value,
    onValueChange,
    hintSize = "base",
    hintAlign = "right",
    hintVariant = "primary",
    ...rest
}) => {
    const inputRef = useRef<any>(null);

    const handleClick = () => {
        inputRef.current.focus();
    }

    return (
        <div onClick={() => { handleClick() }} className={`${containerClassName} relative bg-english-violet text-white rounded-lg cursor-text`} >
            <NumericFormat getInputRef={inputRef} value={value === 0 ? '' : value} allowNegative={false} onValueChange={onValueChange} allowLeadingZeros={false} allowedDecimalSeparators={['.', ',']} thousandSeparator="," thousandsGroupStyle="thousand" fixedDecimalScale placeholder={value === 0 ? "0.00" : rest.placeholder} disabled={rest.disabled} className={`${className} bg-transparent focus:outline-none rounded-lg p-2`} />
            {hintContent && <div className={`absolute text-${hintSize} top-2 ${HINT_ALIGN[hintAlign]}`}>{hintContent}</div>}
        </div>
    )
}

export default BorderedNumberInput