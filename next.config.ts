import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/levels/:id(\\d+)",
        destination: "/levels/level-:id/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
