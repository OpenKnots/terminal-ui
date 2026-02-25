import type { NextConfig } from 'next'
import { proxyHeaders } from './proxy'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers: proxyHeaders,
}

export default nextConfig
