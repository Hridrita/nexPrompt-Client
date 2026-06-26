/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com', 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
