import Loading from "@/components/Loading/Loading"
import Providers from "@/contexts/Providers"
import AppLayout from "@/layouts/AppLayout"
import { Suspense } from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Providers>
            <AppLayout>
            <Suspense fallback={<Loading />}>{children}</Suspense>
            </AppLayout>
        </Providers>
    )
}

export default Layout