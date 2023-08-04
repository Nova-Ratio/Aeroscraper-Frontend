import GradientButton from '@/components/Buttons/GradientButton'
import OutlinedButton from '@/components/Buttons/OutlinedButton'
import BorderedContainer from '@/components/Containers/BorderedContainer'
import { Logo, RedeemIcon } from '@/components/Icons/Icons'
import BorderedNumberInput from '@/components/Input/BorderedNumberInput'
import { getValueByRatio, SEI_TO_AUSD_RATIO } from '@/utils/contractUtils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import Text from "@/components/Texts/Text"
import { PageData } from '../_types/types'
import useAppContract from '@/contracts/app/useAppContract'
import { INotification } from '@/contexts/NotificationProvider'

interface Props {
  pageData: PageData,
  getPageData: () => void,
  refreshBalance: () => void
}

const RedeemSide: FC<Props> = ({ pageData, getPageData, refreshBalance }) => {
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [seiAmount, setSeiAmount] = useState(0);
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [notification, setNotification] = useState<INotification | null>(null);

  const contract = useAppContract();

  const changeRedeemAmount = useCallback((values: NumberFormatValues) => {
    setRedeemAmount(Number(values.value))
    setSeiAmount(getValueByRatio(values.value, (1 - (SEI_TO_AUSD_RATIO - 1))))
  }, []);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 1500);
    }
  }, [notification])


  const redeem = async () => {
    try {
      setProcessLoading(true);
      const res = await contract.redeem(redeemAmount);

      setNotification(
        {
          status: 'success',
          directLink: res?.transactionHash
        }
      )
      getPageData();
      refreshBalance();
    }
    catch (err) {
      console.error(err);
    }
    setNotification(
      {
        status: 'error',
        directLink: ''
      }
    )

    setProcessLoading(false);
  };

  return (
    <BorderedContainer containerClassName="w-full h-full row-span-2" className="px-4 py-6 flex flex-col justify-center items-center relative">
      <div className="relative w-full bg-dark-purple rounded-lg p-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <NumericFormat
            value={pageData.ausdBalance}
            thousandsGroupStyle="thousand"
            thousandSeparator=","
            fixedDecimalScale
            decimalScale={2}
            displayType="text"
            renderText={(value) =>
              <Text size="base">
                Available <span className="font-medium">${value} AUSD</span>
              </Text>
            }
          />
          <div className="flex items-center gap-2">
            <OutlinedButton
              containerClassName="w-[61px] h-6"
              onClick={() => {
                setRedeemAmount(pageData.ausdBalance)
                setSeiAmount(getValueByRatio(pageData.ausdBalance, SEI_TO_AUSD_RATIO))
              }}
            >
              Max
            </OutlinedButton>
            <OutlinedButton
              containerClassName="w-[61px] h-6"
              onClick={() => {
                setRedeemAmount(getValueByRatio(pageData.ausdBalance, 0.5))
                setSeiAmount(getValueByRatio(getValueByRatio(pageData.ausdBalance, 0.5), SEI_TO_AUSD_RATIO))
              }}
            >
              Half
            </OutlinedButton>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo width="40" height="40" />
            <Text size="2xl" weight="font-medium">AUSD</Text>
          </div>
          <BorderedNumberInput
            value={redeemAmount}
            onValueChange={changeRedeemAmount}
            containerClassName="h-10"
            className="w-[262px] text-end"
          />
        </div>
        <RedeemIcon height="48" width="48" className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[40px]" />
      </div>
      <div className="w-full bg-dark-purple rounded-lg px-2 py-7 flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <img alt="sei" src="/images/sei.png" className="w-10 h-10" />
          <Text size="2xl" weight="font-medium">SEI</Text>
        </div>
        <BorderedNumberInput
          value={seiAmount}
          containerClassName="h-10"
          className="w-[262px] text-end"
          disabled
        />
      </div>
      <GradientButton
        loading={processLoading}
        className="w-[221px] h-11 mt-7"
        rounded="rounded-lg"
        onClick={redeem}
      >
        Redeem
      </GradientButton>
      <div className='absolute -right-4 -top-1 overflow-hidden'>
        <AnimatePresence>
          {notification &&
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.5,
                ease: "backInOut"
              }}
              className='relative w-full'>
              <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-[calc(50%+10px)]'>
                <div className="flex justify-center items-center gap-2 whitespace-nowrap">
                  <div className='w-6 h-6 text-white'>
                    {VARIANTS[notification.status].icon}
                  </div>
                  <span className="text-sm font-medium text-white flex-1">{VARIANTS[notification.status].title}</span>
                </div>
                <a href={notification.directLink ? `https://sei.explorers.guru/transaction/${notification.directLink}` : undefined} target="_blank" rel="noreferrer" className="flex justify-center items-center gap-2 mt-1.5">
                  <img alt='external-link' src='/images/external-link.svg' className='w-4 h-4' />
                  <span className="text-white underline font-medium text-sm">View Explorer</span>
                </a>
              </div>
              <svg width="227" height="126" viewBox="0 0 297 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.500968 78.4269C-2.1734 54.1456 27.5064 35.5734 52.4218 20.336C73.8649 7.22217 99.9872 0.670903 127.465 0.77978C154.346 0.886281 191.227 -0.361951 212.797 11.881C228 15.881 258 22.8808 278.5 56.3808C288.5 67.3807 300.499 88.8813 294.999 141.381C272.009 155.341 159.473 156.437 130.247 154.148C104.563 152.136 84.7618 139.723 64.2528 127.753C39.2635 113.169 3.13601 102.351 0.500968 78.4269Z" fill="url(#paint0_linear_745_2827)" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.420207 76.2348C-2.11234 51.2412 25.9936 33.6538 49.5877 19.2244C69.8937 6.80599 94.6309 0.602127 120.652 0.705214C146.107 0.806079 169.305 8.18597 189.731 19.7797C214.199 33.6678 243.21 48.4466 245.635 71.6448C248.13 95.5146 226.01 117.055 201.458 131.965C179.687 145.185 150.962 148.108 123.286 145.94C98.9642 144.035 80.2128 132.28 60.7914 120.946C37.1272 107.135 2.91551 96.8904 0.420207 74.2348Z" fill="#1A0B1C" className='translate-x-4 translate-y-1.5' />
                <defs>
                  <linearGradient id="paint0_linear_745_2827" x1="-62.001" y1="23.8804" x2="276.164" y2="173.788" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#B43255" />
                    <stop offset="0.370783" stop-color="#D73A4E" />
                    <stop offset="0.569842" stop-color="#DB3E43" />
                    <stop offset="0.835184" stop-color="#F8B810" />
                    <stop offset="1" stop-color="#F8B810" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>}
        </AnimatePresence>
      </div>
    </BorderedContainer>
  )
}

export default RedeemSide;

const VARIANTS: Record<Status, any> = {
  success: {
    icon: (
      <img alt='transaction-success' src='/images/transaction-success.svg' />
    ),
    title: "Transaction Successful",
  },
  error: {
    icon: (
      <img alt='transaction-error' src='/images/transaction-error.svg' />
    ),
    title: "Transaction Failed",
  }
};

type Status = "error" | "success"