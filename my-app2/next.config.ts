import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	 experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
	env: {
		MARK:process.env.MARK
	}
};

export default nextConfig;
