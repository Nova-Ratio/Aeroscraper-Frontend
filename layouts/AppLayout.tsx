'use client'

import MaintenancePage from "@/components/MaintenancePage";
import { useState } from "react";
import AppTheme from "./AppTheme";
import DisclaimerController from "@/contexts/DisclaimerProvider";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [isProjectMaintenance] = useState(false); // manage the project's maintenance status here

    if (isProjectMaintenance) {
        return <MaintenancePage />
    }

    return (
        <DisclaimerController>
            <AppTheme />
            <div className='container mx-auto px-1 md:px-[64px]'>
                {children}
            </div>
        </DisclaimerController>
    )
}

export default AppLayout
