import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { esmExternals: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
};

export default nextConfig;
