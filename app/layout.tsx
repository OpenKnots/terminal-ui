import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'terminal-ui - Beautiful Terminal Components for React',
    template: '%s | terminal-ui',
  },
  description:
    'Beautiful terminal-like UI components for the web. Build CLI experiences in React.',
  metadataBase: new URL('https://terminal-ui.openknots.com'),
  openGraph: {
    title: 'terminal-ui - Beautiful Terminal Components for React',
    description:
      'Beautiful terminal-like UI components for the web. Build CLI experiences in React.',
    siteName: 'terminal-ui',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'terminal-ui - Beautiful Terminal Components for React',
    description:
      'Beautiful terminal-like UI components for the web. Build CLI experiences in React.',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
