/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n: {
    //     locales: ['en', 'lt'],

    //     defaultLocale: 'en',
    // },
}

const withNextIntl = require('next-intl/plugin')(
    './i18n.js'
  )

module.exports = withNextIntl({
  experimental: {appDir: true}
});
