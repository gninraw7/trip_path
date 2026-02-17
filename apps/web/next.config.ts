import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trip-path/shared-types', '@trip-path/shared-utils', '@trip-path/ui-components'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.trip-path.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
