import type { NextConfig } from 'next'

type SecurityHeader = {
  key: string
  value: string
}

const securityHeaders: SecurityHeader[] = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

export const proxyHeaders: NextConfig['headers'] = async () => [
  {
    source: '/(.*)',
    headers: securityHeaders,
  },
]
