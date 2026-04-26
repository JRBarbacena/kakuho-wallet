import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabling Turbopack to solve build-time caching/evaluation issues
  // turbopack: {}, 
  serverExternalPackages: ['@aztec/bb.js', 'poseidon-lite'],
  transpilePackages: [],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
