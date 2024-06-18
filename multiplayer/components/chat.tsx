"use client";

import { useState, useEffect } from "react";
import { iot, mqtt } from "aws-iot-device-sdk-v2";
import styles from "./chat.module.css";
import { sendMessage } from "@/server-actions/messages/send-message";

function createConnection(
  endpoint: string,
  authorizer: string,
  token?: string
) {
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

export default function Chat({
  topic,
  endpoint,
  authorizer,
  token,
}: {
  topic: string;
  endpoint: string;
  authorizer: string;
  token?: string;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connection, setConnection] =
    useState<mqtt.MqttClientConnection | null>(null);

  useEffect(() => {
    if (!token) return;
    const connection = createConnection(endpoint, authorizer, token);

    connection.on("connect", async () => {
      try {
        await connection.subscribe(topic, mqtt.QoS.AtLeastOnce);
        setConnection(connection);
      } catch (e) {}
    });
    connection.on("message", (_fullTopic, payload) => {
      const message = new TextDecoder("utf8").decode(new Uint8Array(payload));
      setMessages((prev) => [...prev, message]);
    });
    connection.on("error", console.error);

    connection.connect();

    return () => {
      connection.disconnect();
      setConnection(null);
    };
  }, [topic, endpoint, authorizer, token]);

  return (
    <div className={styles.chat}>
      {messages.length > 0 && (
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          const input = (e.target as HTMLFormElement).message;

          await sendMessage(input.value);
          input.value = "";
        }}
      >
        <input
          required
          autoFocus
          type="text"
          name="message"
          placeholder={connection ? "Ready! Say hello..." : "Connecting..."}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
