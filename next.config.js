/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // 🔥 This ensures App Router is treated as active
    },
  };
  
  module.exports = nextConfig;
  