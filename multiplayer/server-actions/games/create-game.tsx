"use server";

import { getUser, validateRequest } from "@/auth/auth-guard";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { Resource } from "sst";
import { sendMessage } from "../messages/send-message";
import { GameStatus } from "@/models/game";
import { MessageType } from "@/models/message";
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp";

export const createGame = async () => {
  const { userId } = await getUser();
  if (!userId) throw new Error(`PERMISSION DENIED`);
  const dynamoDBClient = new DynamoDBClient({});
  const gameId = generateId(15); // Generates a unique identifier for the game

  try {
    await dynamoDBClient.send(
      new PutItemCommand({
        TableName: Resource.GameTable.name,
        Item: {
          gameId: { S: gameId },
          initiatorId: { S: userId },
          status: { S: GameStatus.Waiting },
          expiresAt: { N: (Math.floor(Date.now() / 1000) + 86400).toString() },
          createdAt: { N: Math.floor(Date.now() / 1000).toString() },
          chatHistory: { L: [] },
          constantKey: { S: "constantKey" },
        },
        ConditionExpression: "attribute_not_exists(gameId)",
      })
    );
    await sendMessage(
      {
        type: MessageType.Chat,
        payload: {
          type: "Admin",
          message: `Game Created`,
          timestamp: getCurrentUnixTimestamp(),
        },
      },
      gameId
    );
    revalidatePath("/");
    console.log(`Game created successfully with ID: ${gameId}`);
  } catch (error) {
    console.error("Error creating game in DynamoDB:", error);
    throw new Error(`Failed to create game: ${error}`);
  }
};
