"use server";

import { getUser, validateRequest } from "@/auth/auth-guard";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { Resource } from "sst";
import { sendMessage } from "../messages/send-message";

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
          gameId: { S: gameId }, // S: denotes a string type in DynamoDB
          initiatorId: { S: userId }, // Example, generating a dummy user ID for initiator
          status: { S: "waiting" }, // Initial game status, could be 'waiting', 'in progress', etc.
          expiresAt: { N: (Math.floor(Date.now() / 1000) + 86400).toString() }, // Expires in 24 hours
          createdAt: { N: Math.floor(Date.now() / 1000).toString() }, // Expires in 24 hours
          chatHistory: { L: [] }, // Initialize an empty chat history
          constantKey: { S: "constantKey" },
        },
        ConditionExpression: "attribute_not_exists(gameId)", // Ensures game with this ID doesn't already exist
      })
    );
    await sendMessage(`game created: ${userId}`, gameId);
    revalidatePath("/");
    console.log(`Game created successfully with ID: ${gameId}`);
  } catch (error) {
    console.error("Error creating game in DynamoDB:", error);
    throw new Error(`Failed to create game: ${error}`);
  }
};
