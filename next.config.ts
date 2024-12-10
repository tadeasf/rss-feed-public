import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '_http_common': false,
        'dns': false,
        'net': false,
        'tls': false,
        'fs': false,
        'cloudflare-scraper': false,
      }
    }

    // Exclude problematic dependencies from client bundle
    if (!isServer) {
      config.module = {
        ...config.module,
        exprContextCritical: false,
        rules: [
          ...config.module.rules,
          {
            test: /node_modules\/torrent-search-api/,
            use: 'null-loader'
          }
        ]
      }
    }

    return config
  }
}

export default nextConfig;
