import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/sabkatechbazar/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Headers for cache control - especially important for mobile app wrappers
  async headers() {
    return [
      {
        // API routes should never be cached
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
      {
        // Add cache versioning for static assets
        source: "/:path*",
        headers: [
          {
            key: "X-App-Version",
            value: process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
