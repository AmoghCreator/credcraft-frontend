/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ENDPOINT: `${process.env.NEXT_PUBLIC_ENDPOINT}`,
  },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {fs: false};

    return config;
  },
};

export default nextConfig;
