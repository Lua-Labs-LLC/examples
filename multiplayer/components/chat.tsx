"use client";

import { useState, useEffect } from "react";
import { iot, mqtt } from "aws-iot-device-sdk-v2";
import styles from "./chat.module.css";

function createConnection(endpoint: string, authorizer: string) {
  const client = new mqtt.MqttClient();
  const id = window.crypto.randomUUID();

  return client.new_connection(
    iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id(`client_${id}`)
      .with_endpoint(endpoint)
      .with_custom_authorizer("", authorizer, "", "PLACEHOLDER_TOKEN")
      .build()
  );
}

export default function Chat({
  topic,
  endpoint,
  authorizer,
}: {
  topic: string;
  endpoint: string;
  authorizer: string;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connection, setConnection] =
    useState<mqtt.MqttClientConnection | null>(null);

  useEffect(() => {
    const connection = createConnection(endpoint, authorizer);

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
  }, [topic, endpoint, authorizer]);

  return (
    <div className={styles.chat}>
      {connection && messages.length > 0 && (
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

          connection!.publish(topic, input.value, mqtt.QoS.AtLeastOnce);
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
        <button type="submit" disabled={connection === null}>
          Send
        </button>
      </form>
    </div>
  );
}
