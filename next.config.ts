import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'], // 如果使用外部图片源
  },
};

export default nextConfig;
