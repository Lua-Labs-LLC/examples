import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
  UserId,
} from "lucia";

interface UserDoc extends RegisteredDatabaseUserAttributes {
  userId: UserId;
}

interface SessionDoc extends RegisteredDatabaseSessionAttributes {
  sessionId: string;
  userId: UserId;
  expiresAt: number;
}

export class DynamoDBAdapter implements Adapter {
  private client: DynamoDBClient;
  private userTable: string;
  private sessionTable: string;

  constructor(client: DynamoDBClient, userTable: string, sessionTable: string) {
    this.client = client;
    this.userTable = userTable;
    this.sessionTable = sessionTable;
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.client.send(
      new DeleteItemCommand({
        TableName: this.sessionTable,
        Key: marshall({ sessionId }),
      })
    );
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    // Scans can be inefficient; ideally, use a GSI for user-specific queries
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.sessionTable,
        IndexName: "UserIdIndex", // Make sure this GSI is set up in your DynamoDB table
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({
          ":userId": userId,
        }),
      })
    );

    for (const item of result.Items || []) {
      await this.deleteSession(item.sessionId.S as string);
    }
  }

  public async getSessionAndUser(
    sessionId: string
  ): Promise<[DatabaseSession | null, DatabaseUser | null]> {
    const sessionResult = await this.client.send(
      new GetItemCommand({
        TableName: this.sessionTable,
        Key: marshall({ sessionId }),
      })
    );

    if (!sessionResult.Item) {
      return [null, null];
    }

    const session = transformIntoDatabaseSession(
      unmarshall(sessionResult.Item) as SessionDoc
    );

    const userResult = await this.client.send(
      new GetItemCommand({
        TableName: this.userTable,
        Key: marshall({ userId: session.userId }),
      })
    );

    if (!userResult.Item) {
      return [session, null];
    }

    const user = transformIntoDatabaseUser(
      unmarshall(userResult.Item) as UserDoc
    );
    return [session, user];
  }

  public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.sessionTable,
        IndexName: "UserIdIndex", // Make sure this GSI is set up
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({
          ":userId": userId,
        }),
      })
    );

    return (result.Items || []).map((item) =>
      transformIntoDatabaseSession(unmarshall(item) as SessionDoc)
    );
  }

  public async setSession(session: DatabaseSession): Promise<void> {
    await this.client.send(
      new PutItemCommand({
        TableName: this.sessionTable,
        Item: marshall({
          sessionId: session.id,
          userId: session.userId,
          expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
          ...session.attributes,
        }),
      })
    );
  }

  public async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date
  ): Promise<void> {
    await this.client.send(
      new UpdateItemCommand({
        TableName: this.sessionTable,
        Key: marshall({ sessionId }),
        UpdateExpression: "set expiresAt = :expiresAt",
        ExpressionAttributeValues: marshall({
          ":expiresAt": Math.floor(expiresAt.getTime() / 1000),
        }),
      })
    );
  }

  public async deleteExpiredSessions(): Promise<void> {
    // This operation is not straightforward in DynamoDB as it does not support server-side expiration
    // Consider using TTL settings or a scheduled Lambda function to clean up expired sessions
  }
}

function transformIntoDatabaseUser(userDoc: UserDoc): DatabaseUser {
  const { userId: id, ...attributes } = userDoc;
  return { id, attributes };
}

function transformIntoDatabaseSession(sessionDoc: SessionDoc): DatabaseSession {
  const { sessionId: id, userId, expiresAt, ...attributes } = sessionDoc;
  return {
    id,
    userId,
    expiresAt: new Date(sessionDoc.expiresAt * 1000),
    attributes,
  };
}
