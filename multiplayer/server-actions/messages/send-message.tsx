"use server";
import "server-only";
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";
import { Resource } from "sst";
import { saveMessage } from "./save-message";
import "server-only";
import { Message } from "@/models/message";
const client = new IoTDataPlaneClient({
  endpoint: `https://${Resource.MyRealtime.endpoint}`,
});

const prefix = `${Resource.App.name}/${Resource.App.stage}`;

export const sendMessage = async (message: Message, gameId: string) => {
  const topic = `${prefix}/${gameId}`; // Specific topic for messages

  try {
    const command = new PublishCommand({
      topic: topic,
      payload: JSON.stringify(message),
      qos: 1,
    });

    await saveMessage(message, gameId);
    await client.send(command);
    console.log("Message published successfully to topic:", topic);
  } catch (error) {
    console.error("Failed to publish message:", error);
  }
};
