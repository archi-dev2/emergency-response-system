import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-f8bd5635-6abf-4fec-aa8f-36f17336c414.space-z.ai",
  ],
};

export default nextConfig;
