/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/shared"],
  basePath: "/b",
  experimental: {
    serverActions: {
      allowedOrigins: ["*.sandbox.lualabs.xyz"],
    },
  },
};
