import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: require('path').resolve(__dirname, '../../'),
};

export default nextConfig;
