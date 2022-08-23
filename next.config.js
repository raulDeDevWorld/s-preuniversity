/* @type {import('next').NextConfig} */
// const withPWA = require('next-pwa')

// module.exports = withPWA({
//   reactStrictMode: true,
//   swcMinify: true,
//   pwa: {
//     dest: 'public'
//   }
// })

const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  }
})