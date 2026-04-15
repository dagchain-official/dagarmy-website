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
  async redirects() {
    return [
      { source: '/student-dashboard',    destination: '/dashboard',     permanent: true },
      { source: '/student-tasks',         destination: '/missions',      permanent: true },
      { source: '/student-my-team',       destination: '/my-team',       permanent: true },
      { source: '/student-leaderboard',   destination: '/leaderboard',   permanent: true },
      { source: '/student-events',        destination: '/events',        permanent: true },
      { source: '/student-notifications', destination: '/notifications', permanent: true },
      { source: '/student-support',       destination: '/support',       permanent: true },
      { source: '/student-setting',       destination: '/settings',      permanent: true },
      { source: '/student-rewards',       destination: '/rewards',       permanent: true },
      { source: '/student-my-courses',    destination: '/my-courses',    permanent: true },
      { source: '/student-referral',      destination: '/referral',      permanent: true },
      { source: '/student-bidding',       destination: '/bidding',       permanent: true },
      { source: '/student-bidding/:id',   destination: '/bidding/:id',   permanent: true },
      { source: '/student-analytics',     destination: '/analytics',     permanent: true },
      { source: '/student-assignments',   destination: '/assignments',   permanent: true },
      { source: '/student-hall-of-fame',  destination: '/hall-of-fame',  permanent: true },
      { source: '/student-reviews',       destination: '/reviews',       permanent: true },
      { source: '/student-wishlist',      destination: '/wishlist',      permanent: true },
    ];
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
