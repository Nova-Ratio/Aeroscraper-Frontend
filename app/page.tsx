import ShapeContainer from '@/components/ShapeContainer'
import Text from '@/components/Texts/Text'

export default function Home() {
  return (
    <main className='flex flex-col'>
      <div className='flex flex-col gap-4 lg:pr-[50%] mt-11'>
        <Text size='4xl'>What is Aeroscraper?</Text>
        <Text size='2xl'>
          Aeroscraper is a decentralized lending-borrowing protocol that offers an interest-free, over-collateralized stable coin and DeFi loans, built specifically to be user-centric.
        </Text>
        <Text size='2xl'>
          Aeroscraper is a fully automated and governance-free decentralized protocol designed to allow unauthorized lending and borrowing for users.
        </Text>
        <Text size='2xl'>
          Aeroscraper allows users to deposit collateral and get loans in stablecoins pegged to US dollars.
        </Text>
        <Text size='2xl'>
          Aeroscraper has a 0% interest rate that charges users a one-time fee, instead of charging a variable interest rate for taking out loans.
        </Text>
      </div>
      <div className='flex flex-col gap-8 mt-16 mb-20'>
        <Text size='4xl'>What’s the main benefits of Aeroscraper?</Text>
        <div className='relative flex flex-wrap'>
          <ShapeContainer width='w-full lg:w-[300px]'>
            <div className='flex items-end h-1/2'>
              <Text size='lg'>
                0% interest rate
              </Text>
            </div>
          </ShapeContainer>
          <ShapeContainer width='w-full lg:w-[399px]' height='h-[343px]'>
            <div className='flex items-center h-1/2 lg:h-full'>
              <Text size='lg'>
                Only a 110% coverage rate
              </Text>
            </div>
          </ShapeContainer>
          <ShapeContainer width='w-full lg:w-[323px]' height='h-[303px]' className='lg:mt-40'>
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
  )
}
