import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.GITHUB_ACTIONS && repositoryName && !repositoryName.endsWith(".github.io")
  ? `/${repositoryName}`
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
