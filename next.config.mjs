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
  basePath: '/questionnaire',  // Add the base path here
  async rewrites() {
    return [
      {
        source: '/questionnaire/:path*',
        destination: 'https://questionnaire-official.vercel.app/:path*',
      },
    ]
  },
}

export default nextConfig

