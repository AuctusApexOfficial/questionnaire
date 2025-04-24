/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: '/questionnaire', // This ensures the correct routing for /questionnaire
  async rewrites() {
    return [
      {
        source: '/questionnaire/:path*',  // Match anything under /questionnaire
        destination: 'https://questionnaire-official.vercel.app/:path*',  // Route to your Vercel deployed questionnaire
      },
    ];
  },
}

export default nextConfig;
