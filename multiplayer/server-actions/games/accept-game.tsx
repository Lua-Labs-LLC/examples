"use server"

import { getUser } from "@/auth/auth-guard"
import {
  getCurrentUnixTimestamp,
  isCurrentTimeGreaterThan,
} from "@/lib/unix-timestamp"
import { GameStatus } from "@/models/game"
import { MessageType } from "@/models/message"
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { revalidatePath } from "next/cache"
import { Resource } from "sst"
import { sendMessage } from "../messages/send-message"
import { getGameById } from "./get-game-by-id"

export const acceptGame = async (gameId: string) => {
  const { userId } = await getUser()

  if (!userId) throw new Error(`PERMISSION DENIED`)
  const dynamoDBClient = new DynamoDBClient({})

  const marshalledKey = marshall({ gameId: gameId })
  const marshalledValues = marshall({
    ":status": GameStatus.Started,
  })

  try {
    const game = await getGameById(gameId)

    if (
      game.initiatorId !== userId ||
      isCurrentTimeGreaterThan(game.timeToAccept) ||
      game.status !== "Waiting"
    ) {
      throw "ERROR"
    }
    await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: Resource.GameTable.name,
        Key: marshalledKey,
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeValues: marshalledValues,
        ExpressionAttributeNames: {
          "#status": "status",
        },
      })
    )
    await sendMessage(
      {
        type: MessageType.GameStatus,
        payload: {
          status: "Started",
          message: "Game Starting",
          timestamp: getCurrentUnixTimestamp(),
        },
      },
      gameId
    )
    revalidatePath("/")
  } catch (error) {
    console.error("Error updating DynamoDB:", error)
    throw new Error(`Failed to update item: ${error}`)
  }
}
