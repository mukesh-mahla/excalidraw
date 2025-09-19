import type { NextConfig } from "next";
import path from "path";


const nextConfig: NextConfig = {
   webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, './'); // makes @ point to app root
    return config;
  },
};

export default nextConfig;
