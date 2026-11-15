/** @type {import('next').NextConfig} */
const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/+$/, '');

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  redirects: async () => {
    if (!mediaBaseUrl) return [];
    return [
      {
        source: '/images/:path*',
        destination: `${mediaBaseUrl}/images/:path*`,
        permanent: false,
      },
      {
        source: '/videos/:path*',
        destination: `${mediaBaseUrl}/videos/:path*`,
        permanent: false,
      },
    ];
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
      ],
    },
  ],
};

export default nextConfig;
