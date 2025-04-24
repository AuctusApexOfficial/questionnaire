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
  basePath: '/questionnaire', // This ensures that the paths are prefixed with /questionnaire

  async rewrites() {
    return [
      {
        source: '/questionnaire/:path*',  // Match any URL under /questionnaire
        destination: 'https://questionnaire-official.vercel.app/:path*',  // Redirect to the questionnaire on Vercel
      },
    ];
  },
}

export default nextConfig;
