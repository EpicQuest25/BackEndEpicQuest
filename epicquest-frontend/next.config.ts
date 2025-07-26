/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for Render deployment
  images: {
    unoptimized: true, // Required for static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.hotelbeds.com',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
