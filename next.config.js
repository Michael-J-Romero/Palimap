/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // 🔥 This ensures App Router is treated as active
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;
  