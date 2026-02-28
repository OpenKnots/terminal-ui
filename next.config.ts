import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { securityHeaders } from './security-headers'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers: securityHeaders,
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
