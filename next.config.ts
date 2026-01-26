import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.michalina.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
