"use server";
import "server-only";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { marshall } from "@aws-sdk/util-dynamodb";
import { validateRequest } from "@/auth/auth-guard";
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp";
import { Message } from "@/models/message";

export const saveMessage = async (message: Message, gameId: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error(`PERMISSION DENIED`);
  const dynamoDBClient = new DynamoDBClient({});
  const messageItem = {
    ...message,
  };

  const marshalledKey = marshall({ gameId: gameId });
  const marshalledValues = marshall({
    ":message": [messageItem],
    ":empty_list": [], // Marshalling an empty list directly
  });

  try {
    await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: Resource.GameTable.name,
        Key: marshalledKey,
        UpdateExpression:
          "SET chatHistory = list_append(if_not_exists(chatHistory, :empty_list), :message)",
        ExpressionAttributeValues: marshalledValues,
      })
    );
  } catch (error) {
    console.error("Error saving message to DynamoDB:", error);
    throw new Error(`Failed to save message: ${error}`);
  }
};
