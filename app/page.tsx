import ShapeContainer from '@/components/Containers/ShapeContainer'
import Text from '@/components/Texts/Text'
import LandingLayout from '@/layouts/LandingLayout'

export default function Home() {
  return (
    <LandingLayout>
      <main className='flex flex-col'>
        <div className='flex flex-col gap-4 lg:pr-[50%] mt-11'>
          <Text size='4xl'>What is Aeroscraper?</Text>
          <Text size='2xl'>
            Aeroscraper is a user-centric decentralized lending-borrowing protocol that revolutionizes the DeFi space with its interest-free, over-collateralized stablecoin and DeFi loans.
          </Text>
          <Text size='2xl'>
            This fully automated and governance-free protocol enables unauthorized lending and borrowing, empowering users with autonomy and direct transactions.
          </Text>
          <Text size='2xl'>
            By depositing collateral, users can access loans in stablecoins pegged to the US dollar, all without incurring any interest.
          </Text>
          <Text size='2xl'>
            Instead, Aeroscraper charges a one-time fee, eliminating the complexities of variable interest rates. With its innovative approach, Aeroscraper enhances the user experience, promotes financial inclusion, and represents the future of decentralized finance.
          </Text>
        </div>
        <div className='flex flex-col gap-8 mt-16 mb-20'>
          <Text size='4xl'>What’s the main benefits of Aeroscraper?</Text>
          <div className='relative flex flex-wrap'>
            <ShapeContainer hasAnimation width='w-full lg:w-[300px]'>
              <div className='flex items-end h-1/2'>
                <Text size='lg'>
                  0% interest rate
                </Text>
              </div>
            </ShapeContainer>
            <ShapeContainer width='w-full lg:w-[399px]' height='h-[343px]'>
              <div className='flex items-center h-1/2 lg:h-full'>
                <Text size='lg'>
                  Only a 115% coverage rate
                </Text>
              </div>
            </ShapeContainer>
            <ShapeContainer hasAnimation width='w-full lg:w-[323px]' height='h-[303px]' className='lg:mt-40'>
              <div className='flex items-center h-full'>
                <Text size='lg'>
                  Censorship resistant - protocol not controlled by anyone
                </Text>
              </div>
            </ShapeContainer>
            <ShapeContainer width='w-full lg:w-[363px]' height='h-[323px]' className='lg:ml-40 lg:-mt-20'>
              <div className='flex items-center h-full'>
                <Text size='lg'>
                  No management is required - all operations are algorithmic and fully automated
                </Text>
              </div>
            </ShapeContainer>
            <ShapeContainer width='w-full lg:w-[405px]' height='h-[361px]'>
              <div className='flex items-center h-1/2 lg:h-full'>
                <Text size='lg'>
                  Direct redeemable – stablecoin can be redeemed at face value for underlying collateral anytime and anywhere
                </Text>
              </div>
            </ShapeContainer>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
