/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // This wildcard matches any hostname
      },
      {
        protocol: 'https',
        hostname: '**', // This wildcard matches any hostname
      },
    ],
  },
};


export default nextConfig;
