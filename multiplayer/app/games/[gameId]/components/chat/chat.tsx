"use client";
import { unstable_noStore as noStore } from "next/cache";
import { useContext } from "react";
import { Message } from "./message/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameContext } from "../../game-provider";

export default function Chat() {
  noStore();
  const { messages, sendMessage, game, isConnected } = useContext(GameContext);
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

          await sendMessage(input.value, game.gameId);
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
