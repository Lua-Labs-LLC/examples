"use server";

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Game } from "@/models/game";

export const getRecentGames = async () => {
  const dynamoDBClient = new DynamoDBClient({});

  try {
    const result = await dynamoDBClient.send(
      new QueryCommand({
        TableName: Resource.GameTable.name,
        IndexName: "RecentGamesIndex", // Query against the new GSI
        KeyConditionExpression: "constantKey = :constantKey", // Use the constant value for the hash key
        ExpressionAttributeValues: {
          ":constantKey": { S: "constantKey" }, // The constant value used for the hash key
        },
        ScanIndexForward: false, // false to sort by createdAt in descending order
        Limit: 10, // limit to 10 items
      })
    );

    if (!result.Items) throw new Error(`Failed to retrieve recent games`);
    const games = result.Items.map((item) => unmarshall(item)) as Game[];
    return games;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    throw new Error(`Failed to retrieve recent games: ${error}`);
  }
};
