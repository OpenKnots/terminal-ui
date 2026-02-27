import type { NextConfig } from 'next'
import { securityHeaders } from './security-headers'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers: securityHeaders,
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
