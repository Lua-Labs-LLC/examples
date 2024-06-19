import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { Lucia } from "lucia"
import { Resource } from "sst"
import { DynamoDBAdapter } from "./dynamo-db-adapter"
const dynamoDBClient = new DynamoDBClient()

const adapter = new DynamoDBAdapter(
  dynamoDBClient,
  Resource.UserTable.name,
  Resource.SessionTable.name
)

export const lucia = new Lucia(adapter)

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
  }
}
