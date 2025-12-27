import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable reactCompiler for compatibility
  // reactCompiler: true,
  output: 'standalone', // Required for Docker/Coolify deployments

  // Ensure proper tracing for standalone builds
  experimental: {
    // This helps with API route inclusion in standalone
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
