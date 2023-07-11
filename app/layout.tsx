import './globals.css'
import { Exo } from 'next/font/google'

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
        {children}
      </body>
    </html>
  )
}
