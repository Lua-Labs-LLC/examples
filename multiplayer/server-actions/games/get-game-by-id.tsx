"use server"

import { Game } from "@/models/game"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import { Resource } from "sst"

export const getGameById = async (gameId: string): Promise<Game> => {
  const dynamoDBClient = new DynamoDBClient({})

  try {
    const result = await dynamoDBClient.send(
      new GetItemCommand({
        TableName: Resource.GameTable.name,
        Key: {
          gameId: { S: gameId }, // Key structure for primary key
        },
      })
    )

    if (!result.Item) throw new Error(`Game with ID ${gameId} not found`)
    const game = unmarshall(result.Item) as Game
    return game
  } catch (error) {
    console.error("Error retrieving game from DynamoDB:", error)
    throw new Error(`Failed to retrieve game: ${error}`)
  }
}
