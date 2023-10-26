'use client'

import { Logo } from "@/components/Icons/Icons"
import { TowerAnimation } from "@/components/Icons/TowerAnimation"
import Text from "@/components/Texts/Text"
import { useWallet } from "@/contexts/WalletProvider";
import { ClientEnum } from "@/types/types";
import { FC, ReactNode } from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { clientType } = useWallet();

    const chainTheme: Record<ClientEnum, ReactNode> = {
        [ClientEnum.COSMWASM]: <PrimaryTheme clientType={ClientEnum.COSMWASM} />,
        [ClientEnum.ARCHWAY]: <PrimaryTheme clientType={ClientEnum.ARCHWAY} />,
        [ClientEnum.NEUTRON]: <PrimaryTheme clientType={ClientEnum.NEUTRON} />,
        [ClientEnum.INJECTIVE]: <PrimaryTheme clientType={ClientEnum.INJECTIVE} />,
    }

    const selectedTheme = chainTheme[clientType!] || <PrimaryTheme clientType={clientType} />;

    return (
        <>
            {selectedTheme}
            <div className='container mx-auto px-8'>
                {children}
            </div>
        </>
    )
}

export default AppLayout

const PrimaryTheme: FC<{ clientType: ClientEnum | undefined }> = ({ clientType }) => {

    return <>
        <TowerAnimation />
        <img src='/images/bg-shape-1.svg' className='fixed right-0 top-0 -z-20 select-none pointer-events-none' alt="tower" />
        <img src='/images/bg-shape-2.svg' className='fixed right-4 top-[420px] -z-20 select-none pointer-events-none' alt="tower" />
        <img src='/images/bg-shape-3.svg' className='fixed right-16 bottom-0 -z-20 select-none pointer-events-none' alt="tower" />
        <header className='w-full flex flex-col items-end gap-10 pt-8 pb-4 px-8 mb-6'>
            <div className='flex items-center gap-6'>
                <Text size='3xl'>Aeroscraper</Text>
                <Logo className='lg:w-[72px] lg:h-[72px] w-[64px] h-[64px]' />
            </div>
            {clientType && (
                <div className={`flex items-center absolute ${clientType === ClientEnum.ARCHWAY ? "top-20 right-32" : clientType === ClientEnum.NEUTRON ? "top-[84px] right-32" : clientType === ClientEnum.INJECTIVE ? "top-[90px] right-32" : "top-14 right-40"}`}>
                    <Text size='lg'>on</Text>
                    {
                        clientType == ClientEnum.ARCHWAY ?
                            <img alt={clientType} src={"/images/archway.svg"} className='w-full h-12 -ml-1' /> :
                            clientType == ClientEnum.NEUTRON ?
                                <img alt={clientType} src={"/images/neutron-network.svg"} className='w-full h-5 ml-2' />
                                :
                                clientType == ClientEnum.INJECTIVE ?
                                    <img alt={clientType} src={"/images/injective.svg"} className='w-full h-5 ml-2' />
                                    :
                                    <img alt={clientType} src={"/images/sei-red.svg"} className='w-full h-24 -ml-2' />

                    }
                </div>
            )}
        </header>
    </>
}