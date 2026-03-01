import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
