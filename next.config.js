/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  server: {
    port: 3001,
  },
};

module.exports = nextConfig;
