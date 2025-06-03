import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ncxrpxflwhwpwftvbvsf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
}

export default nextConfig
