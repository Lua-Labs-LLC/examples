"use server";

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getUser, validateRequest } from "@/auth/auth-guard";
import { revalidatePath } from "next/cache";
import { sendMessage } from "../messages/send-message";
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp";
import { GameStatus } from "@/models/game";
import { MessageType } from "@/models/message";

export const joinGame = async (gameId: string) => {
  const { userId } = await getUser();
  if (!userId) throw new Error(`PERMISSION DENIED`);
  const dynamoDBClient = new DynamoDBClient({});

  const marshalledKey = marshall({ gameId: gameId });
  const marshalledValues = marshall({
    ":timeToAccept": getCurrentUnixTimestamp() + 30,
    ":secondPlayerId": userId,
    ":status": GameStatus.Waiting,
  });

  try {
    await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: Resource.GameTable.name,
        Key: marshalledKey,
        UpdateExpression:
          "SET secondPlayerId = :secondPlayerId, #status = :status, timeToAccept = :timeToAccept",
        ExpressionAttributeValues: marshalledValues,
        ExpressionAttributeNames: {
          "#status": "status", // This maps #status to the actual attribute name "status"
        },
        ConditionExpression: "attribute_not_exists(secondPlayerId)",
      })
    );
    await sendMessage(
      {
        type: "GameStatus",
        payload: {
          status: "Waiting",
          message: "Player Joined",
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
