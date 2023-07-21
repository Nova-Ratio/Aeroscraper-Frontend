import GradientButton from '@/components/Buttons/GradientButton';
import StatisticCard from '@/components/Cards/StatisticCard';
import InputLayout from '@/components/Input/InputLayout';
import { Modal } from '@/components/Modal/Modal';
import Text from '@/components/Texts/Text';
import Info from '@/components/Tooltip/Info';
import useAppContract from '@/contracts/app/useAppContract';
import { motion } from 'framer-motion';
import React, { FC, useMemo, useState } from 'react'
import { NumberFormatValues } from 'react-number-format/types/types';
import { PageData } from '../_types/types';
import OutlinedButton from '@/components/Buttons/OutlinedButton';
import BorderedContainer from '@/components/Containers/BorderedContainer';
import Accordion from '@/components/Accordion/Accordion';

enum TABS {
  COLLATERAL = 0,
  BORROWING
}

type Props = {
  open: boolean;
  onClose?: () => void;
}

const StabilityPoolModal: FC<Props> = ({ open, onClose }) => {


  return (
    <Modal key="stability-pool" layoutId="stability-pool" title="Stability Pool" showModal={open} onClose={() => { onClose?.(); }}>
      <div className="-ml-4">
        <Info message={"Enter the amount of AUSD you'd like to deposit."} status={"normal"} />
        <div className="flex flex-row w-1/2 ml-10 gap-6 mt-6 mb-10">
          <GradientButton className="min-w-[221px] h-16 mt-4" rounded="rounded-lg">
            <Text>Deposit</Text>
          </GradientButton>
          <OutlinedButton className="min-w-[221px] h-16 mt-4">
            <Text>Withdraw</Text>
          </OutlinedButton>
        </div>
        <InputLayout label="Deposit" hintTitle="AUSD" value={0} hasPercentButton={{ max: true, min: false }} />
        <InputLayout label="Pool Share" hintTitle="%" value={0} className="mt-4 mb-6" />
        <div className='bg-dark-purple rounded-lg px-2 py-4 flex items-center'>
          <Text textColor="text-white" weight="font-normal">Reward</Text>
        
          <GradientButton className="min-w-[140px] h-0 ml-auto" rounded="rounded-lg">
            <Text>Claim</Text>
          </GradientButton>
        </div>
        <GradientButton className="min-w-[221px] h-11 mt-6 ml-auto" rounded="rounded-lg">
          <Text>Confirm</Text>
        </GradientButton>
      </div>
    </Modal>
  )
}

export default StabilityPoolModal