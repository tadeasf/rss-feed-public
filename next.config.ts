import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_TORRENT_SERVICE_URL: process.env.NEXT_PUBLIC_TORRENT_SERVICE_URL || 'http://torrent-service:3001',
  }
};

export default nextConfig;
