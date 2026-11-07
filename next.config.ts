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
      {
        source: "/blog/how-to-play-rotate-rings/",
        destination: "/guides/how-to-play/",
        permanent: true,
      },
      {
        source: "/blog/rotate-rings-removal-order-strategy/",
        destination: "/guides/tips/",
        permanent: true,
      },
      {
        source: "/blog/find-rotate-rings-level-by-screenshot/",
        destination: "/guides/level-numbers-changed/",
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
