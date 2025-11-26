/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      encoding: false,
      'pino-pretty': false,
    };
    
    // Ignore node-specific modules in client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        encoding: false,
        'pino-pretty': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
