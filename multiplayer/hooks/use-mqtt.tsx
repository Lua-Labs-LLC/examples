import { useState, useEffect, useCallback } from "react";
import { mqtt, iot } from "aws-iot-device-sdk-v2";
import { ChatMessage, GameStatusMessage, Message } from "@/models/message";
import { userSendMessage } from "@/server-actions/messages/user-send-message";
import { Game } from "@/models/game";

function createConnection(endpoint: string, authorizer: string, token: string) {
  const client = new mqtt.MqttClient();
  const id = window.crypto.randomUUID();
  return client.new_connection(
    iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id(`client_${id}`)
      .with_endpoint(endpoint)
      .with_custom_authorizer("", authorizer, "", token || "")
      .build()
  );
}

export function useMqtt(
  topic: string,
  endpoint: string,
  authorizer: string,
  token: string,
  initialMessages: ChatMessage[]
) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connection, setConnection] =
    useState<mqtt.MqttClientConnection | null>(null);

  useEffect(() => {
    const connection = createConnection(endpoint, authorizer, token);

    connection.on("connect", async () => {
      try {
        await connection.subscribe(topic, mqtt.QoS.AtLeastOnce);
        setConnection(connection);
      } catch (e) {
        console.error(e);
      }
    });

    connection.on("message", (_fullTopic, payload) => {
      const message = JSON.parse(
        new TextDecoder("utf8").decode(new Uint8Array(payload))
      );
      setMessages((prev) => [...prev, message]);
    });

    connection.on("error", console.error);

    connection.connect();

    return () => {
      connection.disconnect();
      setConnection(null);
    };
  }, [topic, endpoint, authorizer, token]);

  const sendMessage = useCallback(async (message: string, gameId: string) => {
    try {
      await userSendMessage(message, gameId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { messages, sendMessage, isConnected: !!connection };
}
