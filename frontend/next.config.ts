import type { NextConfig } from "next";

const surface = process.env.APP_SURFACE === "business" ? "business" : "store";

const nextConfig: NextConfig = {
  distDir: `.next-${surface}`,
};

export default nextConfig;
