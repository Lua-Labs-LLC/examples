"use server"
import { Message } from "@/models/message"
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane"
import "server-only"
import { Resource } from "sst"
import { saveChatMessage } from "./save-chat-message"
import { saveGameAction } from "./save-game-action"
const client = new IoTDataPlaneClient({
  endpoint: `https://${Resource.MyRealtime.endpoint}`,
})

const prefix = `${Resource.App.name}/${Resource.App.stage}`

export const sendMessage = async (message: Message, gameId: string) => {
  const topic = `${prefix}/${gameId}`

  try {
    const command = new PublishCommand({
      topic: topic,
      payload: JSON.stringify(message),
      qos: 1,
    })

    if (message.type === "GameAction") {
      await saveGameAction(message, gameId)
    } else {
      await saveChatMessage(message, gameId)
    }
    await client.send(command)
    console.log("Message published successfully to topic:", topic)
  } catch (error) {
    console.error("Failed to publish message:", error)
  }
}
