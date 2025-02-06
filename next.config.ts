import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // swcMinify: true,
  experimental: { esmExternals: true },
};

export default nextConfig;
