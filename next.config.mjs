import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    port: 3003
  },
  reactStrictMode: false,
   devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/lend',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'mixin-images.zeromesh.net',
      },
      {
        hostname: 'raw.githubusercontent.com',
      },
      {
        hostname: 'kernel.mixin.dev',
      },
      {
        hostname: 'mixin.one',
      },
    ],
  },
}

export default withNextIntl(nextConfig)