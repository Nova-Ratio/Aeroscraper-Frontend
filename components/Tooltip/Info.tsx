import React, { FC } from 'react'
import { InfoIcon } from '../Icons/Icons';
import Text from "@/components/Texts/Text";

interface Props {
  message: string,
  status?: "normal" | "danger"
}

const TEXT_COLOR = {
  "normal": "text-dark-silver",
  "danger": "text-dark-red"
}

const ICON_COLOR = {
  "normal": "text-white",
  "danger": "text-dark-red"
}

const Info: FC<Props> = ({ message, status = "normal" }) => {
  return (
    <div className='flex gap-2 my-2'>
      <InfoIcon className={`w-6 h-6 ${ICON_COLOR[status]}`} />
      <Text size="base" textColor={TEXT_COLOR[status]} weight="font-normal">{message}</Text>
    </div>
  )
}

export default Info;