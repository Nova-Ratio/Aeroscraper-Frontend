'use client';

import GradientButton from "@/components/Buttons/GradientButton"
import { Logo, RightArrow, TwitterLogo, DiscordLogo, NovaRatioIcon } from "@/components/Icons/Icons"
import { Modal } from "@/components/Modal/Modal"
import Text from "@/components/Texts/Text"
import Link from "next/link"
import { useState } from "react"

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    const [privacyModal, setPrivacyModal] = useState(false);

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
            <footer className='flex justify-center sm:justify-between gap-x-48 gap-y-16 items-top flex-wrap px-24 py-16 bg-raisin-black mt-auto relative'>
                <div className="flex-row flex gap-20 items-top">
                    <div className='flex flex-col items-center gap-6'>
                        <Logo />
                        <Text size="2xl" textColor='text-white'>Aeroscraper</Text>
                    </div>
                    <div onClick={() => { setPrivacyModal(true); }} className='flex flex-col items-center gap-4'>
                        <Text size="2xl" textColor='text-white'>Product</Text>
                        <Text textColor='text-ghost-white/75' className="cursor-pointer">Whitepaper</Text>
                        <Text textColor='text-ghost-white/75' className="cursor-pointer">Terms of service</Text>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-6'>
                    <Text size="2xl">Definition of Aeroscraper</Text>
                    <div className='flex flex-col items-center gap-4'>
                        <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definations-of-aeroscraper/definition-of-name'} className='hover:scale-105 transition-all flex gap-2'>
                            <Text textColor='text-white'>Definition of name</Text>
                        </Link>
                        <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definations-of-aeroscraper/definition-of-icon'} className='hover:scale-105 transition-all flex gap-2'>
                            <Text textColor='text-white'>Definition of icon</Text>
                        </Link>
                        <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definations-of-aeroscraper/definition-of-colors'} className='hover:scale-105 transition-all flex gap-2'>
                            <Text textColor='text-white'>Definition of colors</Text>
                        </Link>
                        <Link href={'https://aeroscraper.gitbook.io/aeroscraper/definations-of-aeroscraper/definition-of-typography'} className='hover:scale-105 transition-all flex gap-2'>
                            <Text textColor='text-white'>Definition of typography</Text>
                        </Link>
                        <Link href={'https://aeroscraper.gitbook.io/aeroscraper/'} className='hover:scale-105 transition-all flex gap-2'>
                            <Text textColor='text-white'>Definition of concept</Text>
                        </Link>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-6'>
                    <Text size="2xl">Community</Text>
                    <div className='flex flex-col items-center gap-4'>
                        <Link href={'#'} className='hover:scale-105 transition-all flex gap-2'>
                            <TwitterLogo />
                            <Text textColor='text-white'>Twitter</Text>
                        </Link>
                        <Link href={'https://discord.gg/zVYHsqM9rq'} className='hover:scale-105 transition-all flex gap-2'>
                            <DiscordLogo />
                            <Text textColor='text-white'>Discord</Text>
                        </Link>
                    </div>
                </div>
                <div className="absolute left-1/2 right-1/2 -translate-x-20 bottom-4 whitespace-nowrap flex items-end">
                    <Text size="base" textColor='text-white'>Product by</Text>
                    <Link className="ml-2 mb-0.5" href={"https://www.novaratio.tech/"}>
                        <NovaRatioIcon />
                    </Link>
                </div>
            </footer>

            <Modal title="Terms of service" showModal={privacyModal} onClose={() => { setPrivacyModal(false); }} childrenClassName="h-2/3 overflow-y-scroll mt-12">
                <Text size="sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ab optio rem, perspiciatis eum quam alias magnam consequatur est ad pariatur corrupti, quidem soluta ipsam corporis tempore! Asperiores qui totam praesentium, animi perspiciatis ipsum illum velit at magnam fugit amet beatae dignissimos nemo magni accusantium. Minus corrupti rem ex maiores, amet magni saepe, eligendi vitae veritatis cupiditate officiis fugit expedita recusandae illo provident perspiciatis harum temporibus ut assumenda error! Perspiciatis soluta nemo id quaerat a eligendi commodi itaque corrupti, earum, dolorum velit ratione perferendis sapiente eum iure? Ipsa harum in aliquid provident repellendus est quaerat eaque. Possimus perferendis veniam quidem.               Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia facere dicta quis quos doloribus quas, iusto repudiandae? Beatae deleniti repellat, voluptatum rem enim eligendi inventore porro, animi vel aliquid totam ipsum quibusdam modi sed labore ipsa qui dicta tempora dolorum! Id nostrum voluptatibus velit, corporis doloremque qui repellat neque magni, adipisci laudantium sint minima sit soluta error excepturi amet alias placeat esse earum optio fugit. Aut repellat id dignissimos cumque ab quod quam voluptatem blanditiis, rem officia, odit sed tempora explicabo iusto aperiam, obcaecati quaerat fuga perferendis ex est quis placeat. Provident illo ab quidem ipsam perferendis facere consequatur eaque?
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia facere dicta quis quos doloribus quas, iusto repudiandae? Beatae deleniti repellat, voluptatum rem enim eligendi inventore porro, animi vel aliquid totam ipsum quibusdam modi sed labore ipsa qui dicta tempora dolorum! Id nostrum voluptatibus velit, corporis doloremque qui repellat neque magni, adipisci laudantium sint minima sit soluta error excepturi amet alias placeat esse earum optio fugit. Aut repellat id dignissimos cumque ab quod quam voluptatem blanditiis, rem officia, odit sed tempora explicabo iusto aperiam, obcaecati quaerat fuga perferendis ex est quis placeat. Provident illo ab quidem ipsam perferendis facere consequatur eaque? ipsum dolor sit amet consectetur adipisicing elit. Eveniet ab optio rem, perspiciatis eum quam alias magnam consequatur est ad pariatur corrupti, quidem soluta ipsam corporis tempore! Asperiores qui totam praesentium, animi perspiciatis ipsum illum velit at magnam fugit amet beatae dignissimos nemo magni accusantium. Minus corrupti rem ex maiores, amet magni saepe, eligendi vitae veritatis cupiditate officiis fugit expedita recusandae illo provident perspiciatis harum temporibus ut assumenda error! Perspiciatis soluta nemo id quaerat a eligendi commodi itaque corrupti, earum, dolorum velit ratione perferendis sapiente eum iure? Ipsa harum in aliquid provident repellendus est quaerat eaque. Possimus perferendis veniam quidem.               Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia facere dicta quis quos doloribus quas, iusto repudiandae? Beatae deleniti repellat, voluptatum rem enim eligendi inventore porro, animi vel aliquid totam ipsum quibusdam modi sed labore ipsa qui dicta tempora dolorum! Id nostrum voluptatibus velit, corporis doloremque qui repellat neque magni, adipisci laudantium sint minima sit soluta error excepturi amet alias placeat
                </Text>
            </Modal>
        </>
    )
}

export default LandingLayout
