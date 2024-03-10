/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const hostnames = [
  'images.igdb.com',
  'upload.wikimedia.org',
  'cdn-icons-png.flaticon.com',
  'www.freeiconspng.com',
  'loodibee.com',
  'www.vhv.rs',
  'logos-world.net',
  'cdn.freebiesupply.com',
  'www.gran-turismo.com',
  'upload.wikimedia.org',
  'avatars.githubusercontent.com',
  '1000logos.net',
  'cdn2.steamgriddb.com',
  'raw.githubusercontent.com',
  'pngimg.com',
  'www.atari-computermuseum.de',
  'www.shareicon.net'
]
const config = {


  experimental: {
    appDir: true
  },
  swcMinify: true,
  optimizeFonts: true,
  images: {
    unoptimized: true,
    remotePatterns: hostnames.map(hostname => ({
      protocol: 'https',
      hostname
    })),
    minimumCacheTTL: 15000000,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/:path*',
      },
      // {
      //   source: '/',
      //   destination: '/en',
      // },
    ];
  },

  pageExtensions: ['jsx', 'js', 'ts', 'tsx'],



  async headers() {
    return [
      {
        // matching all API routes
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // { key: "Access-Control-Allow-Origin", value: "https://play-infinite-jonas-jasul.vercel.app" },
          { key: "Access-Control-Allow-Origin", value: "*" },

          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default withPlaiceholder(withNextIntl(config));
