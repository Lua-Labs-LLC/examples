"use server"
import { lucia } from "@/auth/lucia"

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { generateId } from "lucia"
import { cookies } from "next/headers"
import { Resource } from "sst"

export async function signInSignUp() {
  const userId = generateId(15)
  const dynamoDBClient = new DynamoDBClient({})
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: Resource.UserTable.name,
      Item: marshall({
        userId: userId,
      }),
      ConditionExpression: "attribute_not_exists(userId)",
    })
  )
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}
