/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/cpanel',
        destination: 'https://cpanel.agrikima.co.ke:2083',
        permanent: false,
      },
      {
        source: '/webmail',
        destination: 'https://cpanel.agrikima.co.ke:2096',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
