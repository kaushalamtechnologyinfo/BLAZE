import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/all-products/:page*", destination: "/products", permanent: true },
      { source: "/image-gallery/:page*", destination: "/gallery", permanent: true },
      { source: "/latest-updates/:page*", destination: "/updates", permanent: true },
      { source: "/brochure/:page+", destination: "/brochure", permanent: true },
    ];
  },
};

export default nextConfig;
