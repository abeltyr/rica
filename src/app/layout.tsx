import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { EditorProvider } from '@/context/editor'
import { TrackHistoryProvider } from '@/context/trackHistory'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EditorProvider>
          {children}
        </EditorProvider>
      </body>
    </html>
  )
}
