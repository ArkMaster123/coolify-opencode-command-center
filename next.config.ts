import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable reactCompiler for compatibility
  // reactCompiler: true,
  output: 'standalone', // Required for Docker/Coolify deployments

  // Ensure API routes are included in standalone build
  experimental: {
    outputFileTracingRoot: undefined,
  },

  // Make sure server components work
  reactStrictMode: true,
};

export default nextConfig;
