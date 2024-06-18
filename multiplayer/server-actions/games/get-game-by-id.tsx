"use server";

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const getGameById = async (gameId: string) => {
  const dynamoDBClient = new DynamoDBClient({});

  try {
    const result = await dynamoDBClient.send(
      new GetItemCommand({
        TableName: Resource.GameTable.name,
        Key: {
          gameId: { S: gameId }, // Key structure for primary key
        },
      })
    );

    if (!result.Item) throw new Error(`Game with ID ${gameId} not found`);
    const game = unmarshall(result.Item);
    return game;
  } catch (error) {
    console.error("Error retrieving game from DynamoDB:", error);
    throw new Error(`Failed to retrieve game: ${error}`);
  }
};
