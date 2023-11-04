import React, { FC, useEffect, useState } from 'react'
import Text from "@/components/Texts/Text"
import { INotification, useNotification } from '@/contexts/NotificationProvider';
import { useWallet } from '@/contexts/WalletProvider';
import useAppContract from '@/contracts/app/useAppContract';
import { isNil } from 'lodash';
import { NumericFormat } from 'react-number-format';
import { PageData } from '../../../_types/types';
import TransactionButton from '@/components/Buttons/TransactionButton';

interface Props {
  pageData: PageData,
  getPageData: () => void,
  refreshBalance: () => void
  basePrice: number;
}

const ClaimRewardTab: FC<Props> = ({ }) => {

  const { baseCoin } = useWallet();
  const [injAmount, setInjAmount] = useState(0);
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [notification, setNotification] = useState<INotification | undefined>(undefined);


  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(undefined);
      }, 2000);
    }
  }, [notification])


  return (
    <section>
      <Text size='3xl'>Claim your rewards in INJ</Text>
      <div className='mt-6'>
        <div className="w-full bg-cetacean-dark-blue border border-white/10 rounded-2xl px-6 py-9 flex items-end justify-between mt-6">
          <div>
            <Text size="sm" weight="mb-2">Reward</Text>
            {
              !isNil(baseCoin) ?
                <div className="flex items-center gap-2">
                  <img alt="token" src={baseCoin.image} className="w-6 h-6" />
                  <Text size="base" weight="font-medium">{baseCoin.name}</Text>
                </div>
                :
                <Text size="2xl" weight="font-medium" className='flex-1 text-center'>-</Text>
            }
          </div>
          <NumericFormat
            value={injAmount}
            thousandsGroupStyle="thousand"
            thousandSeparator=","
            fixedDecimalScale
            decimalScale={2}
            displayType="text"
            renderText={(value) =>
              <Text size="5xl" textColor='text-gradient' weight='font-normal'>
                {value}
              </Text>
            }
          />
        </div>
        <TransactionButton
          status={notification}
          loading={processLoading}
          className="w-[375px] h-11 mt-7 ml-auto"
          onClick={()=>{}}
          text='Claim Rewards'
        />
      </div>
    </section>
  )
}

export default ClaimRewardTab;