import { WalletProvider } from '@/contexts/WalletProvider'
import './globals.css'
import { Exo } from 'next/font/google'
import { NotificationProvider } from '../contexts/NotificationProvider'
import { TransactionsProvider } from '@/contexts/TransactionContext'

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
            <TransactionsProvider>
              {children}
            </TransactionsProvider>
          </WalletProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}