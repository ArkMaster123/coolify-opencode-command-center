import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
