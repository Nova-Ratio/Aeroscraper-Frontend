import React from 'react'
import { InjectiveBackgroundWave, LogoSecondary } from './Icons/Icons'
import Text from "@/components/Texts/Text"
import InjectiveStatisticSide from '@/app/app/dashboard/_components/Injective/InjectiveStatisticSide'

const MaintenancePage = () => {
  return (
    <div className='mx-[85px]'>
      <header className='mb-[88px] mt-8 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <LogoSecondary className='w-10 h-10' />
          <Text size='2xl'>Aeroscraper</Text>
        </div>
      </header>

      <div className='flex justify-between'>
      <InjectiveStatisticSide basePrice={0} disabledStats />

        <div className='w-1/3 flex justify-end flex-col gap-4'>
          <Text size='5xl' textColor='text-[#E4462D]'>Under Maintenance! Your Site is Getting Updated, Will Be Back Shortly.</Text>
          <Text size='lg' >Our site is undergoing maintenance for an important update. We're working to provide you with a better experience. Thank you for your patience and support.</Text>
        </div>
      </div>
      <InjectiveBackgroundWave animate className="absolute -bottom-60 left-0 rotate-90 -z-10 md:w-[500px] w-[300px]" />

    </div>
  )
}

export default MaintenancePage