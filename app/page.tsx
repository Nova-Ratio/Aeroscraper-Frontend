import Text from '@/components/Texts/Text'

export default function Home() {
  return (
    <main className='flex flex-col'>
      <div className='flex flex-col gap-4 pr-[50%] mt-11'>
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
      <div className='flex flex-col gap-8 pr-[50%] mt-16'>
        <Text size='4xl'>What’s the main benefits of Aeroscraper?</Text>
        <div className='h-[600px]'>
          {/* PLACEHOLDER */}
        </div>
      </div>
    </main>
  )
}
