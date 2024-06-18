import { Lucia } from "lucia";
import { DynamoDBAdapter } from "./dynamo-db-adapter";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
const dynamoDBClient = new DynamoDBClient();

const adapter = new DynamoDBAdapter(
  dynamoDBClient,
  Resource.UserTable.name,
  Resource.SessionTable.name
);

export const lucia = new Lucia(adapter);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
