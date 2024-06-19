"use client"

import { joinGame } from "@/server-actions/games/join-game"
import { Button } from "./ui/button"

export const JoinGame = ({ gameId }: { gameId: string }) => {
  const action = async () => {
    await joinGame(gameId)
  }
  return <Button onClick={() => action()}>Join Game</Button>
}
