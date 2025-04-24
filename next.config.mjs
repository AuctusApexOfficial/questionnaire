/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/questionnaire',
  async rewrites() {
    return [
      {
        source: '/questionnaire/:path*',
        destination: 'https://questionnaire-official.vercel.app/:path*',
      },
    ];
  },
}

export default nextConfig;
