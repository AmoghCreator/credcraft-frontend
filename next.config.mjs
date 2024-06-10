/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ENDPOINT: 'http://127.0.0.1:8080',
  },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {fs: false};

    return config;
  },
};

export default nextConfig;
