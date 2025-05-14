/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-big-calendar'],
    experimental: {
      appDir: true, // 🔥 This ensures App Router is treated as active
    },
    typescript: {
      ignoreBuildErrors: true,
    },
      compiler: {
    styledComponents: {
      displayName: true, // useful in dev
      ssr: true,         // required for server-side rendering support
    },
  },
  };
  
  module.exports = nextConfig;
  