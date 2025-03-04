import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { esmExternals: true },
  eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
