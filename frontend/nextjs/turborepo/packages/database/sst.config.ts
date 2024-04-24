/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "db",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Postgres("MyDatabase", {
      version: "16.1",
      databaseName: "my_database",
      scaling: {
        min: "0.5 ACU",
        max: "1 ACU",
      },
    });
  },
});
