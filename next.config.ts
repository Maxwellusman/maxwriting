import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        // Redirect www to non-www
        source: "/:path*",
        has: [{ type: "host", key: "host", value: "www.maxwritings.com" }],
        destination: "https://maxwritings.com/:path*",
        permanent: true,
      },
      {
        // Redirect http to https
        source: "/:path*",
        has: [{ type: "protocol", key: "protocol", value: "http" }],
        destination: "https://maxwritings.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
