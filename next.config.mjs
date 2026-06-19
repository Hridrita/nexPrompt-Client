/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
