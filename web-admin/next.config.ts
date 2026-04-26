import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabling Turbopack to solve build-time caching/evaluation issues
  // turbopack: {}, 
  serverExternalPackages: ['@aztec/bb.js', 'poseidon-lite'],
  transpilePackages: ['@aztec/bb.js', 'poseidon-lite'],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
