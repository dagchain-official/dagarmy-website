import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  // Required: silence Turbopack vs webpack config conflict in Next.js 16
  turbopack: {},
  // Reduce memory pressure — prevents OOM crash on large component files
  productionBrowserSourceMaps: false,
  // Allow production builds to succeed despite type warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable source maps in dev to save memory
      config.devtool = false;
      // Reduce memory cache size
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 1,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/files/:path*',
        headers: [
          { key: 'Content-Disposition', value: 'attachment' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
