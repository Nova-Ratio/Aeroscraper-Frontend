'use client'

import { useWallet } from "@/contexts/WalletProvider";
import { ClientEnum } from "@/types/types";
import { FC, ReactNode } from "react";
import InjeciveTheme from "./themes/InjectiveTheme";
import { PrimaryTheme } from "./themes/PrimaryTheme";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { clientType } = useWallet();

    const chainTheme: Record<ClientEnum, ReactNode> = {
        [ClientEnum.SEI]: <PrimaryTheme clientType={ClientEnum.SEI} />,
        [ClientEnum.ARCHWAY]: <PrimaryTheme clientType={ClientEnum.ARCHWAY} />,
        [ClientEnum.NEUTRON]: <PrimaryTheme clientType={ClientEnum.NEUTRON} />,
        [ClientEnum.INJECTIVE]: <InjeciveTheme />,
    }

    const selectedTheme = chainTheme[clientType!] || <PrimaryTheme clientType={clientType} />;

    return (
        <>
            {selectedTheme}
            <div className='container mx-auto'>
                {children}
            </div>
        </>
    )
}

export default AppLayout
