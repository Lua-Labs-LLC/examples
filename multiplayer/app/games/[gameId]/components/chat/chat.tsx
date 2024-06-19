"use client";

import { useState, useEffect } from "react";
import { iot, mqtt } from "aws-iot-device-sdk-v2";
import { userSendMessage } from "@/server-actions/messages/user-send-message";
import { ChatMessage } from "@/models/message";
import { Message } from "./message/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMqtt } from "@/hooks/use-mqtt";

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

export default function Chat({
  topic,
  endpoint,
  authorizer,
  token,
  gameId,
  chatHistory,
}: {
  topic: string;
  endpoint: string;
  authorizer: string;
  token: string;
  gameId: string;
  chatHistory: ChatMessage[];
}) {
  const { messages, sendMessage, isConnected } = useMqtt(
    topic,
    endpoint,
    authorizer,
    token,
    chatHistory
  );

  return (
    <div className=" w-[320px] h-[320px] flex flex-col justify-between">
      {messages.length > 0 && (
        <div className="overflow-scroll h-full flex flex-col border border-b-none p-2 gap-2">
          {messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const input = (e.target as HTMLFormElement).message;

          await sendMessage(input.value, gameId);
          input.value = "";
        }}
      >
        <div className="flex flex-row">
          <Input
            className="rounded-none"
            required
            autoFocus
            type="text"
            name="message"
            placeholder={isConnected ? "Ready! Say hello..." : "Connecting..."}
          />
          <Button className="rounded-none" type="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
