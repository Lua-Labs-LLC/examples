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
    const gameTable = new sst.aws.Dynamo("GameTable", {
      fields: {
        gameId: "string",
        initiatorId: "string",
        expiresAt: "number",
        createdAt: "number",
        constantKey: "string", // Field for the constant partition key
      },
      primaryIndex: {
        hashKey: "gameId",
      },
      globalIndexes: {
        InitiatorIndex: {
          hashKey: "initiatorId",
          rangeKey: "expiresAt",
        },
        RecentGamesIndex: {
          hashKey: "constantKey", // A constant value to partition all items in a single partition
          rangeKey: "createdAt", // Sort key to sort by creation time
        },
      },
      stream: "new-and-old-images",
      ttl: "expiresAt",
    });

    const realtime = new sst.aws.Realtime("MyRealtime", {
      authorizer: {
        handler: "authorizer.handler",
        link: [sessionTable, userTable, gameTable],
      },
    });

    new sst.aws.Nextjs("MyWeb", {
      link: [realtime, sessionTable, userTable, gameTable],
    });
  },
});
