import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Auctus Apex – Questionnaire',
  description: 'Tell us about your vision. Tailored marketing, AI automation, and web design by Auctus Apex.',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* SEO & Social Sharing */}
        <meta property="og:title" content="Auctus Apex – Questionnaire" />
        <meta property="og:description" content="Tell us about your vision. Tailored marketing, AI automation, and web design by Auctus Apex." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.auctusapex.com" />
        <meta property="og:image" content="https://www.auctusapex.com/android-chrome-512x512.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Auctus Apex – Questionnaire" />
        <meta name="twitter:description" content="Tell us about your vision. Tailored marketing, AI automation, and web design by Auctus Apex." />
        <meta name="twitter:image" content="https://www.auctusapex.com/android-chrome-512x512.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
