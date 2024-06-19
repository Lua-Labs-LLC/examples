"use client"

import { useMqtt } from "@/hooks/use-mqtt"
import { Game } from "@/models/game"
import { ChatMessage } from "@/models/message"
import { ReactNode, createContext } from "react"

interface GameProviderProps {
  children: ReactNode
  game: Game
  topic: string
  endpoint: string
  authorizer: string
  token: string
}

interface GameState {
  game: Game
  messages: ChatMessage[]
  sendMessage: (message: string, gameId: string) => Promise<void>
  isConnected: boolean
}

export const GameContext = createContext({} as GameState)
const GameProvider = ({
  children,
  game,
  topic,
  endpoint,
  authorizer,
  token,
}: GameProviderProps) => {
  const mqtt = useMqtt(topic, endpoint, authorizer, token, game)
  return (
    <>
      <GameContext.Provider value={{ ...mqtt }}>
        {children}
      </GameContext.Provider>
    </>
  )
}

export default GameProvider
