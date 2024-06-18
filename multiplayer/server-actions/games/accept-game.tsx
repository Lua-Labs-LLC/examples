"use server";

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getUser } from "@/auth/auth-guard";
import { revalidatePath } from "next/cache";
import { sendMessage } from "../messages/send-message";
import {
  getCurrentUnixTimestamp,
  isCurrentTimeGreaterThan,
} from "@/lib/unix-timestamp";
import { getGameById } from "./get-game-by-id";
import { GameStatus } from "@/models/game";
import { MessageType } from "@/models/message";

export const acceptGame = async (gameId: string) => {
  const { userId } = await getUser();

  if (!userId) throw new Error(`PERMISSION DENIED`);
  const dynamoDBClient = new DynamoDBClient({});

  const marshalledKey = marshall({ gameId: gameId });
  const marshalledValues = marshall({
    ":status": GameStatus.Started,
  });

  try {
    const game = await getGameById(gameId);

    if (
      game.initiatorId !== userId ||
      isCurrentTimeGreaterThan(game.timeToAccept) ||
      game.status !== "Starting"
    ) {
      throw "ERROR";
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
    );
    await sendMessage(
      {
        type: MessageType.Chat,
        payload: {
          type: "Admin",
          message: "Game Starting",
          timestamp: getCurrentUnixTimestamp(),
        },
      },
      gameId
    );
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating DynamoDB:", error);
    throw new Error(`Failed to update item: ${error}`);
  }
};