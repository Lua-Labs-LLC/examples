import { Game } from "@/models/game"
import { ChatMessage, Message } from "@/models/message"
import { userSendMessage } from "@/server-actions/messages/user-send-message"
import { iot, mqtt } from "aws-iot-device-sdk-v2"
import { useCallback, useEffect, useState } from "react"

function createConnection(endpoint: string, authorizer: string, token: string) {
  const client = new mqtt.MqttClient()
  const id = window.crypto.randomUUID()
  return client.new_connection(
    iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id(`client_${id}`)
      .with_endpoint(endpoint)
      .with_custom_authorizer("", authorizer, "", token || "")
      .build()
  )
}

export function useMqtt(
  topic: string,
  endpoint: string,
  authorizer: string,
  token: string,
  initialGame: Game
) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialGame.chatHistory
  )
  const [game, setGame] = useState(initialGame)
  const [connection, setConnection] =
    useState<mqtt.MqttClientConnection | null>(null)

  useEffect(() => {
    const connection = createConnection(endpoint, authorizer, token)

    connection.on("connect", async () => {
      try {
        await connection.subscribe(topic, mqtt.QoS.AtLeastOnce)
        setConnection(connection)
      } catch (e) {
        console.error(e)
      }
    })

    connection.on("message", (_fullTopic, payload) => {
      const message = JSON.parse(
        new TextDecoder("utf8").decode(new Uint8Array(payload))
      ) as Message
      if (message.type === "User") {
        setMessages((prev) => [...prev, message])
      }
      if (message.type === "GameStatus") {
        setMessages((prev) => [...prev, message])
        setGame((prev) => ({ ...prev, status: message.payload.status }))
      }
      if (message.type === "GameAction") {
        setGame((prev) => ({
          ...prev,
          gameHistory: [...prev.gameHistory, message],
        }))
      }
    })

    connection.on("error", console.error)

    connection.connect()

    return () => {
      connection.disconnect()
      setConnection(null)
    }
  }, [topic, endpoint, authorizer, token])

  const sendMessage = useCallback(async (message: string, gameId: string) => {
    try {
      await userSendMessage(message, gameId)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return {
    messages,
    sendMessage,
    isConnected: !!connection,
    game,
  }
}
