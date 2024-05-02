/* eslint-disable no-undef */
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "app-b",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("AppB", {
      openNextVersion: "3.0.0-rc.15",
      environment: {
        NEXTAUTH_JWT_SECRET: process.env.NEXTAUTH_JWT_SECRET as string,
        DATABASE_NAME: process.env.DATABASE_NAME as string,
        DATABASE_SECRET_ARN: process.env.DATABASE_SECRET_ARN as string,
        DATABASE_RESOURCE_ARN: process.env.DATABASE_RESOURCE_ARN as string,
      },
    });
  },
});
