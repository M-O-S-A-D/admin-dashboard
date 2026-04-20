import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow pre-signed S3 URLs from any AWS region
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
  // Silence the "punycode" deprecation from AWS SDK — harmless in Node 22
  serverExternalPackages: ['@aws-sdk/client-dynamodb', '@aws-sdk/client-s3'],
};

export default nextConfig;
