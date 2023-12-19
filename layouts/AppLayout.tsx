'use client'

import MaintenancePage from "@/components/MaintenancePage";
import { useWallet } from "@/contexts/WalletProvider";
import { ClientEnum } from "@/types/types";
import { ReactNode, useState } from "react";
import ArchwayTheme from "./themes/ArchwayTheme";
import InjeciveTheme from "./themes/InjectiveTheme";
import { PrimaryTheme } from "./themes/PrimaryTheme";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { clientType } = useWallet();

    const chainTheme: Record<ClientEnum, ReactNode> = {
        [ClientEnum.SEI]: <PrimaryTheme clientType={ClientEnum.SEI} />,
        [ClientEnum.ARCHWAY]: <ArchwayTheme />,
        [ClientEnum.NEUTRON]: <PrimaryTheme clientType={ClientEnum.NEUTRON} />,
        [ClientEnum.INJECTIVE]: <InjeciveTheme />,
    }

    const selectedTheme = chainTheme[clientType!] || <InjeciveTheme />;

    const [isProjectMaintenance] = useState(false); // manage the project's maintenance status here

    if(isProjectMaintenance){
        return <MaintenancePage />
    }

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
