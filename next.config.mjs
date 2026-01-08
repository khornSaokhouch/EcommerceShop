/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/storage/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'backend-e-rpi0.onrender.com', pathname: '/storage/**' },
      { protocol: 'https', hostname: 'laravel-images-b2.s3.us-east-005.backblazeb2.com', pathname: '/**' },
      { protocol: 'https', hostname: 'f005.backblazeb2.com', pathname: '/file/laravel-images-b2/**' },
    ],
  },
  experimental: {
    // Adding variations ensures the dev server catches the request correctly
    allowedDevOrigins: ['10.1.86.72', '10.1.86.72:3000'],
    
    serverActions: {
      allowedOrigins: ['10.1.86.72:3000', 'localhost:3000'],
    },
  },
};

export default nextConfig;