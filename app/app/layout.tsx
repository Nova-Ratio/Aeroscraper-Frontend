import AppLayout from "@/layouts/AppLayout"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    )
}

export default Layout