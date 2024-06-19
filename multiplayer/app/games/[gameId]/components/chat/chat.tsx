"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { unstable_noStore as noStore } from "next/cache"
import { useContext } from "react"
import { GameContext } from "../../game-provider"
import { Message } from "./message/message"

export default function Chat() {
  noStore()
  const { messages, sendMessage, game, isConnected } = useContext(GameContext)
  return (
    <div className=" flex h-[320px] w-[320px] flex-col justify-between">
      {messages.length > 0 && (
        <div className="border-b-none flex h-full flex-col gap-2 overflow-scroll border p-2">
          {messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const input = (e.target as HTMLFormElement).message

          await sendMessage(input.value, game.gameId)
          input.value = ""
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
  )
}
