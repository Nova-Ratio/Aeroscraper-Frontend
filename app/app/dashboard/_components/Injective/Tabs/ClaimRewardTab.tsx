import React, { FC } from 'react'
import Text from "@/components/Texts/Text"
import { useNotification } from '@/contexts/NotificationProvider';
import { useWallet } from '@/contexts/WalletProvider';
import useAppContract from '@/contracts/app/useAppContract';
import { isNil } from 'lodash';
import { NumericFormat } from 'react-number-format';
import { PageData } from '../../../_types/types';
import TransactionButton from '@/components/Buttons/TransactionButton';
import { getIsInjectiveResponse } from '@/utils/contractUtils';

interface Props {
  pageData: PageData,
  getPageData: () => void,
  refreshBalance: () => void
  basePrice: number;
}

const ClaimRewardTab: FC<Props> = ({ pageData, getPageData, refreshBalance, basePrice }) => {

  const { baseCoin } = useWallet();

  const contract = useAppContract();
  const { addNotification, processLoading, setProcessLoading } = useNotification();

  const rewardClaim = async () => {
    setProcessLoading(true);

    try {
      const res = await contract.withdrawLiquidationGains();
      addNotification({
        status: 'success',
        directLink: getIsInjectiveResponse(res) ? res?.txHash : res?.transactionHash,
      })
      getPageData();
      refreshBalance();
    }
    catch (err) {
      console.log(err);
      addNotification({
        message: "",
        status: 'error',
        directLink: ""
      })
    }
    setProcessLoading(false);
  }
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
            value={pageData.rewardAmount}
            thousandsGroupStyle="thousand"
            thousandSeparator=","
            fixedDecimalScale
            decimalScale={6}
            displayType="text"
            renderText={(value) =>
              <Text size="5xl" textColor='text-gradient' weight='font-normal'>
                {value}
              </Text>
            }
          />
        </div>
        <TransactionButton
          loading={processLoading}
          disabled={pageData.rewardAmount == 0}
          className="w-[375px] h-11 mt-7 ml-auto"
          onClick={() => { rewardClaim(); }}
          text='Claim Rewards'
        />
      </div>
    </section>
  )
}

export default ClaimRewardTab;