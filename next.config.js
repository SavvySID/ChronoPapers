module.exports = {
  env: {
    DATABASE_URL: 'file:./dev.db',
  },
  // Temporarily disable all minification to avoid unicode/minifier parse issues
  swcMinify: false,
  webpack: (config) => {
    config.optimization.minimize = false
    return config
  },
}
