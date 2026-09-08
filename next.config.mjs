/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["astronomy-engine", "tz-lookup"],
  },
};

export default nextConfig;
