import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ccd4e304506e4b6fa7c94b5dd1821b32.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Fix for "Failed to find Server Action" on deployments like Coolify
  // This helps Next.js handle version skew by detecting build mismatches
  deploymentId: process.env.COOLIFY_COMMIT_HASH || "production-v1",
};

export default nextConfig;
