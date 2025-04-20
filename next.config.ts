import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirect() {
    return [
      {
        source: "/:path*", // Matches all routes
        has: [
          {
            type: "host",
            value: "www.maxwritings.com", // redirect from www to non-www
          },
        ],
        destination: "https://maxwritings.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "protocol",
            value: "http", // redirect http to https
          },
        ],
        destination: "https://maxwritings.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
