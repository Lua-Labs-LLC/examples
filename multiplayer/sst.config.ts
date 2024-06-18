/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "multiplayer",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const userTable = new sst.aws.Dynamo("UserTable", {
      fields: {
        userId: "string",
      },
      primaryIndex: { hashKey: "userId" },
    });

    const sessionTable = new sst.aws.Dynamo("SessionTable", {
      fields: {
        sessionId: "string",
        userId: "string",
        expiresAt: "number",
      },
      primaryIndex: { hashKey: "sessionId" },
      globalIndexes: {
        UserIndex: { hashKey: "userId", rangeKey: "expiresAt" },
      },
    });

    const realtime = new sst.aws.Realtime("MyRealtime", {
      authorizer: {
        handler: "authorizer.handler",
        link: [sessionTable, userTable],
      },
    });

    new sst.aws.Nextjs("MyWeb", {
      link: [realtime, sessionTable, userTable],
    });
  },
});
