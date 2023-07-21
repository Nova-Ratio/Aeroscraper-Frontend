import React, { FC } from 'react'
import BorderedNumberInput from './BorderedNumberInput'
import Text, { TextSizes } from "@/components/Texts/Text";
import { OnValueChange } from 'react-number-format'
import OutlinedButton from '../Buttons/OutlinedButton';


interface Props {
  label?: string,
  labelSize?: TextSizes,
  hintTitle?: string,
  hasPercentButton?: { max: boolean, min: boolean, custom?: boolean }
  customButtonText?: string
  onValueChange?: OnValueChange
  value: string | number,
  className?: string
}
const InputLayout: FC<Props> = ({ label, labelSize = 'lg', customButtonText, hintTitle, value, onValueChange, className, hasPercentButton }) => {
  return (
    <div className={`bg-dark-purple rounded-lg px-2 py-4 flex items-center ${className}`}>
      <Text size={labelSize} textColor="text-white" weight="font-normal">{label}</Text>
      <BorderedNumberInput value={value} onValueChange={onValueChange} hintContent={hintTitle} containerClassName="w-1/2 ml-auto" />
      <div className="px-2">
        {hasPercentButton?.min && (
          <OutlinedButton containerClassName="h-7 min-w-16" rounded="lg">
            <Text size='sm'>MIN</Text>
          </OutlinedButton>
        )}
        {hasPercentButton?.max && (
          <OutlinedButton containerClassName="h-7 w-16" rounded="lg">
            <Text size='sm'>MAX</Text>
          </OutlinedButton>
        )}
        {hasPercentButton?.custom && (
          <OutlinedButton innerClassName="px-2" rounded="lg">
            <Text size='sm'>{customButtonText}</Text>
          </OutlinedButton>
        )}
      </div>
    </div>
  )
}

export default InputLayout