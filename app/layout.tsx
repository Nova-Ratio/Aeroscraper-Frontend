import { WalletProvider } from '@/contexts/WalletProvider'
import './globals.css'
import { Exo } from 'next/font/google'
import { NotificationProvider } from '@/contexts/NotificationProvider'
import NextTopLoader from 'nextjs-toploader';

const exo = Exo({ subsets: ['latin'] })

export const metadata = {
  title: 'Aeroscraper',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${exo.className} relative min-h-screen flex flex-col`}>
        <NotificationProvider>
          <WalletProvider>
            {children}
            <NextTopLoader
             color="#E4462D"
             initialPosition={0.08}
             crawlSpeed={200}
             height={3}
             crawl={true}
             showSpinner={true}
             easing="ease"
             speed={200}
             shadow="0 0 10px #E4462D,0 0 5px #E4462D"
            />
          </WalletProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
