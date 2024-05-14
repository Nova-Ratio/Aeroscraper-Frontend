import Providers from "@/contexts/Providers"
import AppLayout from "@/layouts/AppLayout"
import { Suspense } from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Providers>
            <AppLayout>
                <Suspense>
                    {children}
                </Suspense>
            </AppLayout>
        </Providers>
    )
}

export default Layout