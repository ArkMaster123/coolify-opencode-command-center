import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable reactCompiler for compatibility
  // reactCompiler: true,
  output: 'standalone', // Required for Docker/Coolify deployments
};

export default nextConfig;
