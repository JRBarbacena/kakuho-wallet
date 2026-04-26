import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['@aztec/bb.js'],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
