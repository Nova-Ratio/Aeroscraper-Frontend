import { Logo } from "@/components/Icons/Icons"
import Text from "@/components/Texts/Text"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <img src='/images/bg-tower.svg' className='fixed left-0 bottom-0 -z-20 select-none pointer-events-none' alt="tower" />
            <img src='/images/bg-shape-1.svg' className='fixed right-0 top-0 -z-20 select-none pointer-events-none' alt="tower" />
            <img src='/images/bg-shape-2.svg' className='fixed right-4 top-[420px] -z-20 select-none pointer-events-none' alt="tower" />
            <img src='/images/bg-shape-3.svg' className='fixed right-16 bottom-0 -z-20 select-none pointer-events-none' alt="tower" />
            <header className='w-full flex flex-col items-end gap-10 pt-8 pb-4 px-8'>
                <div className='flex items-center gap-6'>
                    <Text size='3xl'>Aeroscraper</Text>
                    <Logo className='lg:w-[72px] lg:h-[72px] w-[64px] h-[64px]' />
                </div>
            </header>
            <div className='container mx-auto px-8'>
                {children}
            </div>
        </>
    )
}

export default AppLayout