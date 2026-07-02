/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'perenual.com',
      },
      {
        protocol: 'https',
        hostname: 's3.us-central-1.wasabisys.com',
      },
    ],
  },
};

export default nextConfig;
