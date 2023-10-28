import React, { useEffect, useState } from 'react'
import Text from "@/components/Texts/Text"
import { LogoSecondary } from '@/components/Icons/Icons';
import NotificationDropdown from '@/app/app/dashboard/_components/NotificationDropdown';
import usePageData from '@/contracts/app/usePageData';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { useWallet } from '@/contexts/WalletProvider';
import { isNil } from 'lodash';
import { WalletInfoMap, WalletType } from '@/enums/WalletType';

const InjeciveTheme = () => {
  const { balanceByDenom, baseCoin, walletType, refreshBalance } = useWallet();
  const [basePrice, setBasePrice] = useState(0);
  const { pageData, getPageData } = usePageData({ basePrice });
  const wallet = useWallet();

  useEffect(() => {
    const getPrice = async () => {
      const connection = new PriceServiceConnection(
        "https://hermes-beta.pyth.network/",
        {
          priceFeedRequestConfig: {
            binary: true,
          },
        }
      )

      const priceId = ["2d9315a88f3019f8efa88dfe9c0f0843712da0bac814461e27733f6b83eb51b3"];

      const currentPrices = await connection.getLatestPriceFeeds(priceId);

      if (currentPrices) {
        setBasePrice(Number(currentPrices[0].getPriceUnchecked().price) / 100000000);
      }
    }

    getPrice()
  }, []);

  return (
    <header className='mb-[88px] mx-[85px] mt-8 flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <LogoSecondary className='w-10 h-10' />
        <Text size='2xl'>Aeroscraper</Text>
      </div>
      <div className='flex items-center'>
        <div className="flex items-cent<wer gap-2 mr-8">
          <Text size='base'>$1.00</Text>
          <img alt="ausd" className="w-5 h-5" src="/images/token-images/ausd-blue.svg" />
        </div>
        {
          !isNil(baseCoin) &&
          <div className="flex items-center gap-2 mr-16">
            <Text size='base'>$ {basePrice.toFixed(3)}</Text>
            <img alt={baseCoin.name} className="w-5 h-5" src={baseCoin.image} />
          </div>
        }
        <NotificationDropdown />
        <div className='flex ml-16 gap-2'>
          <img
            alt="user-profile-image"
            src={wallet.profileDetail?.photoUrl ?? "/images/profile-images/profile-i-1.jpg"}
            className='rounded-sm bg-raisin-black w-12 h-12'
          />
          <div className='flex flex-col'>
            <div className='flex items-center ml-auto'>
              <img alt={wallet.walletType} className='w-4 h-4 object-contain' src={WalletInfoMap[wallet.walletType ?? WalletType.NOT_SELECTED].thumbnailURL} />
              <Text size='lg' weight='font-regular' className='truncate ml-2'>{wallet.name}</Text>
            </div>
            <Text size='sm'>{wallet.address.slice(32)}...{wallet.address.slice(-5)}</Text>
            <div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default InjeciveTheme;