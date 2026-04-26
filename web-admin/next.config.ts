import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@aztec/bb.js']
  }
};

export default nextConfig;
