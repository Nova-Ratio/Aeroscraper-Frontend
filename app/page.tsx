'use client'

import GradientButton from '@/components/Buttons/GradientButton'
import ShapeContainer from '@/components/Containers/ShapeContainer'
import { InjectiveBackgroundWave, LogoSecondary, RightArrow } from '@/components/Icons/Icons'
import Text from '@/components/Texts/Text'
import LandingLayout from '@/layouts/LandingLayout'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {

  return (
    <div>
      <main>
        <div className='max-w-[626px] ml-[200px]'>
          <div className='flex items-center gap-6 lg:mt-20'>
            <LogoSecondary />
            <Text size="2xl" textColor='text-white'>Aeroscraper</Text>
          </div>
          <h1 className="text-white text-[64px] leading-[72px] font-semibold mt-10">Your decentralised lending-borrowing protocol</h1>
          <h2 className="text-base text-ghost-white font-medium mt-10">
            Empowering you with autonomy and direct transactions. Interest-free, over-collateralized stablecoin and DeFi loans. Fully automated and governance-free, which enables unauthorized lending and borrowing.
            <br /><br />
            The protocol only charges a one-time fee. Deposit collateral and access loans in stablecoins pegged to the US dollar.
          </h2>
          <Link href={"/app/dashboard"}>
            <GradientButton
              className='w-full lg:w-[227px] h-[37px] rounded-lg self-end px-8 group mt-10'
            >
              <Text size='base'>Launch App</Text>
            </GradientButton>
          </Link>
        </div>
        <InjectiveBackgroundWave animate className="absolute -top-3 right-0 -z-10 w-[1200px]" />

      </main>
      <footer className='flex flex-col gap-x-48 gap-y-16 items-top flex-wrap px-20 pr-16 mt-40 pb-24 relative'>
        <div className='flex items-center gap-6 lg:mt-20'>
          <LogoSecondary />
          <Text size="2xl" textColor='text-white'>Aeroscraper</Text>
        </div>
        <div className='grid grid-cols-3 gap-40'>
          <div className='flex flex-col content-start justify-start gap-4'>
            <Text size="sm" textColor='text-white' weight="font-semibold">Product</Text>
            <Text size="sm" textColor='text-white' className="cursor-pointer">Whitepaper</Text>
            <Link href={'https://aeroscraper.gitbook.io/aeroscraper/brand-identity/brand-kit'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
              <Text size="sm" textColor='text-white'>Brand Identity</Text>
            </Link>
          </div>
          <div className='flex flex-col content-start justify-start gap-6'>
            <Text size="sm" weight="font-semibold">Deep dive</Text>
            <div className='flex flex-col content-start gap-3'>
              <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definitions-of-aeroscraper/definition-of-name'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Definition of name</Text>
              </Link>
              <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definitions-of-aeroscraper/definition-of-icon'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Definition of icon</Text>
              </Link>
              <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definitions-of-aeroscraper/definition-of-colors'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Definition of colors</Text>
              </Link>
              <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definitions-of-aeroscraper/definition-of-typography'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Definition of typography</Text>
              </Link>
              <Link href={'https://aeroscraper.gitbook.io/aeroscraper/'} className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Definition of concept</Text>
              </Link>
            </div>
          </div>
          <div className='flex flex-col content-start justify-start gap-6'>
            <Text size="sm" weight="font-semibold">Social</Text>
            <div className='flex flex-col content-start gap-4'>
              <Link href={'https://twitter.com/aeroscraper'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Twitter</Text>
                <img alt='external-link' src='/images/external-link.svg' className='w-4 h-4' />
              </Link>
              <Link href={'https://discord.gg/3R6yTqB8hC'} target="_blank" rel="noopener noreferrer" className='hover:scale-105 transition-all flex gap-2'>
                <Text size="sm" textColor='text-white'>Discord</Text>
                <img alt='external-link' src='/images/external-link.svg' className='w-4 h-4' />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    // <LandingLayout>
    //   <main className='flex flex-col'>
    //     <div className='flex flex-col gap-4 lg:pr-[50%] mt-11'>
    //       <Text size='4xl'>What is Aeroscraper?</Text>
    //       <Text size='2xl'>
    //         Aeroscraper is a user-centric decentralized lending-borrowing protocol that revolutionizes the DeFi space with its interest-free, over-collateralized stablecoin and DeFi loans.
    //       </Text>
    //       <Text size='2xl'>
    //         This fully automated and governance-free protocol enables unauthorized lending and borrowing, empowering users with autonomy and direct transactions.
    //       </Text>
    //       <Text size='2xl'>
    //         By depositing collateral, users can access loans in stablecoins pegged to the US dollar, all without incurring any interest.
    //       </Text>
    //       <Text size='2xl'>
    //         Instead, Aeroscraper charges a one-time fee, eliminating the complexities of variable interest rates. With its innovative approach, Aeroscraper enhances the user experience, promotes financial inclusion, and represents the future of decentralized finance.
    //       </Text>
    //     </div>
    //     <div className='flex flex-col gap-8 mt-16 mb-20'>
    //       <Text size='4xl'>What’s the main benefits of Aeroscraper?</Text>
    //       <div className='relative flex flex-wrap'>
    //         <ShapeContainer hasAnimation width='w-full lg:w-[300px]'>
    //           <div className='flex items-end h-1/2'>
    //             <Text size='lg'>
    //               0% interest rate
    //             </Text>
    //           </div>
    //         </ShapeContainer>
    //         <ShapeContainer width='w-full lg:w-[399px]' height='h-[343px]'>
    //           <div className='flex items-center h-1/2 lg:h-full'>
    //             <Text size='lg'>
    //               Only a 115% coverage rate
    //             </Text>
    //           </div>
    //         </ShapeContainer>
    //         <ShapeContainer hasAnimation width='w-full lg:w-[323px]' height='h-[303px]' className='lg:mt-40'>
    //           <div className='flex items-center h-full'>
    //             <Text size='lg'>
    //               Censorship resistant - protocol not controlled by anyone
    //             </Text>
    //           </div>
    //         </ShapeContainer>
    //         <ShapeContainer width='w-full lg:w-[363px]' height='h-[323px]' className='lg:ml-40 lg:-mt-20'>
    //           <div className='flex items-center h-full'>
    //             <Text size='lg'>
    //               No management is required - all operations are algorithmic and fully automated
    //             </Text>
    //           </div>
    //         </ShapeContainer>
    //         <ShapeContainer width='w-full lg:w-[405px]' height='h-[361px]'>
    //           <div className='flex items-center h-1/2 lg:h-full'>
    //             <Text size='lg'>
    //               Direct redeemable – stablecoin can be redeemed at face value for underlying collateral anytime and anywhere
    //             </Text>
    //           </div>
    //         </ShapeContainer>
    //       </div>
    //     </div>
    //   </main>
    // </LandingLayout>
  )
}
