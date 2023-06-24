/** @type {import('next').NextConfig} */

// const withNextIntl = require('next-intl/plugin')(
//     './i18n.js'
//   )


// module.exports =  withNextIntl({
//   experimental: {appDir: true},
// });
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
module.exports = {
  experimental: { 
    appDir: true 
  },
  swcMinify: true,
  optimizeFonts: true,
  images: {
      remotePatterns: hostnames.map(hostname=>({
        protocol:'https',
        hostname
      })),
      minimumCacheTTL: 15000000,
  },
};