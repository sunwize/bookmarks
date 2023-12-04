const withPWA = require('next-pwa')({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
