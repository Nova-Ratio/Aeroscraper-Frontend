import GradientButton from "@/components/Buttons/GradientButton"
import { Logo, RightArrow, TwitterLogo, DiscordLogo } from "@/components/Icons/Icons"
import Text from "@/components/Texts/Text"
import Link from "next/link"

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <img src='/images/left-secondary-wave.svg' className='absolute left-0 top-0 w-[60%] max-w-[871px] object-contain -z-20 select-none pointer-events-none' alt="left-wave-shadow" />
            <img src='/images/left-gradient-wave.svg' className='absolute left-0 top-0 w-1/2 max-w-[711px] object-contain -z-10 select-none pointer-events-none' alt="left-wave" />
            <img src='/images/landing-wave.svg' className='absolute right-0 lg:opacity-100 opacity-25 top-[213px] w-1/2 max-w-[900px] object-contain -z-10 select-none pointer-events-none' alt="landing-wave" />
            <header className='w-full flex flex-col items-end gap-10 pt-8 pb-10 px-8'>
                <div className='flex items-center gap-6'>
                    <Text size='4xl'>Aeroscraper</Text>
                    <Logo className='lg:w-[96px] lg:h-[96px] w-[64px] h-[64px]' />
                </div>
                <Link href={"/app/dashboard"}>
                    <GradientButton
                        className='w-full lg:w-[314px] self-end px-8 group'
                        endIcon={<RightArrow className='group-hover:translate-x-2 transition-all' />}
                    >
                        <Text size='3xl'>Launch App</Text>
                    </GradientButton>
                </Link>
            </header>
            <div className='container mx-auto px-8'>
                {children}
            </div>
            <footer className='flex justify-center sm:justify-between gap-x-48 gap-y-16 items-center flex-wrap px-24 py-16 bg-raisin-black mt-auto relative'>
                <div className="flex-row flex gap-20 items-center">
                    <div className='flex flex-col items-center gap-6'>
                        <Logo />
                        <Text size="2xl" textColor='text-white'>Aeroscraper</Text>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        <Text size="2xl" textColor='text-white'>Product</Text>
                        <Text textColor='text-ghost-white/75'>Terms of service</Text>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-6'>
                    <Text size="2xl">Community</Text>
                    <div className='flex flex-col items-center gap-4'>
                        <Link href={'#'} className='hover:scale-105 transition-all flex gap-2'>
                            <TwitterLogo />
                            <Text textColor='text-white'>Twitter</Text>
                        </Link>
                        <Link href={'#'} className='hover:scale-105 transition-all flex gap-2'>
                            <DiscordLogo />
                            <Text textColor='text-white'>Discord</Text>
                        </Link>
                    </div>
                </div>
                <Text size="base" textColor='text-white' className="absolute left-1/2 right-1/2 -translate-x-20 bottom-4 whitespace-nowrap">Product by
                    <Link style={{ fontFamily: "Melodrama" }} className="font-medium text-2xl ml-2" href={"https://www.novaratio.tech/"}>
                        Nova Ratio
                    </Link>
                </Text>
            </footer>
        </>
    )
}

export default LandingLayout