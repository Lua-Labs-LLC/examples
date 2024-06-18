"use server";

import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";
import { Resource } from "sst";
import { saveMessage } from "./save-message";

const client = new IoTDataPlaneClient({
  endpoint: `https://${Resource.MyRealtime.endpoint}`,
});

const prefix = `${Resource.App.name}/${Resource.App.stage}`;

export const sendMessage = async (message: string, gameId: string) => {
  const topic = `${prefix}/sst-chat`; // Specific topic for messages

  try {
    const command = new PublishCommand({
      topic: topic,
      payload: message, // Convert message to JSON string
      qos: 1, // QoS 1 corresponds to 'At Least Once' delivery
    });

    await saveMessage(message, gameId);
    await client.send(command);
    console.log("Message published successfully to topic:", topic);
  } catch (error) {
    console.error("Failed to publish message:", error);
  }
};
