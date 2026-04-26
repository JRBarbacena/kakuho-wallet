import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // turbopack: {},
  serverExternalPackages: ['@aztec/bb.js', 'poseidon-lite'],
  transpilePackages: [],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
