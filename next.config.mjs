/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The chat bridge spawns the local `claude` CLI from API routes.
  serverExternalPackages: [],
};

export default nextConfig;
