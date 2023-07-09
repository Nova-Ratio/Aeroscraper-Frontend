import Text from '@/components/Texts/Text'
import './globals.css'
import { Exo } from 'next/font/google'
import { DiscordLogo, Logo, RightArrow, TwitterLogo } from '@/components/Icons/Icons'
import GradientButton from '@/components/Buttons/GradientButton'
import Link from 'next/link'

const exo = Exo({ subsets: ['latin'] })

export const metadata = {
  title: 'Aeroscraper',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${exo.className} relative min-h-screen flex flex-col`}>
        <img src='/images/left-secondary-wave.svg' className='absolute left-0 top-0 w-[60%] max-w-[871px] object-contain -z-20 select-none pointer-events-none' alt="left-wave-shadow" />
        <img src='/images/left-gradient-wave.svg' className='absolute left-0 top-0 w-1/2 max-w-[711px] object-contain -z-10 select-none pointer-events-none' alt="left-wave" />
        <img src='/images/landing-wave.svg' className='absolute right-0 top-[213px] w-1/2 max-w-[900px] object-contain -z-10 select-none pointer-events-none' alt="landing-wave" />
        <header className='w-full flex flex-col items-end gap-10 pt-8 pb-10 px-8'>
          <div className='flex items-center gap-6'>
            <Text size='4xl'>Aerocraper</Text>
            <Logo />
          </div>
          <GradientButton
            className='w-[314px] self-end px-8 group'
            endIcon={<RightArrow className='group-hover:translate-x-2 transition-all' />}
          >
            <Text size='3xl'>Launch App</Text>
          </GradientButton>
        </header>
        <div className='container mx-auto px-8'>
          {children}
        </div>
        <footer className='flex justify-center sm:justify-between gap-x-48 gap-y-16 items-center flex-wrap px-24 py-16 bg-raisin-black mt-auto'>
          <div className='flex flex-col items-center gap-6'>
            <Logo />
            <Text textColor='text-dark-silver'>Terms of service</Text>
          </div>
          <div className='flex flex-col items-center gap-6'>
            <Text size="2xl">Community</Text>
            <div className='flex items-center gap-8'>
              <Link href={'#'} className='hover:scale-105 transition-all'>
                <TwitterLogo />
              </Link>
              <Link href={'#'} className='hover:scale-105 transition-all'>
                <DiscordLogo />
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
