/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Poster generation reads the brand fonts + logo from public/ at runtime via
  // fs; force-include them in the marketing serverless bundle so they exist on
  // Vercel (public assets aren't otherwise traced into function bundles).
  // Under `experimental` on Next 14 (moved to top-level in Next 15).
  experimental: {
    outputFileTracingIncludes: {
      '/api/marketing/**': ['./public/fonts/**', './public/logo.png'],
    },
    // @resvg/resvg-js ships a native .node binary webpack can't bundle — load it
    // at runtime instead. (sharp is externalized by Next automatically.)
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
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
