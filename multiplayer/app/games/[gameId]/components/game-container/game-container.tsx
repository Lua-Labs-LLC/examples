import { getUser } from "@/auth/auth-guard"
import { getGameById } from "@/server-actions/games/get-game-by-id"
import { Resource } from "sst"
import GameProvider from "../../game-provider"
import Chat from "../chat/chat"
import { GameControls } from "../game-controls/game-controls"
import { TicTacToe } from "../tic-tac-toe/tic-tac-toe"

export const GameContainer = async ({ gameId }: { gameId: string }) => {
  const game = await getGameById(gameId)
  const topic = `${Resource.App.name}/${Resource.App.stage}/${game.gameId}`
  const endpoint = Resource.MyRealtime.endpoint
  const authorizer = Resource.MyRealtime.authorizer
  const { sessionId } = await getUser()
  return (
    <GameProvider
      game={game}
      topic={topic}
      endpoint={endpoint}
      authorizer={authorizer}
      token={sessionId!}
    >
      <GameControls />
      <div className="flex w-full flex-row items-center justify-center gap-4">
        <TicTacToe />
        <Chat />
      </div>
    </GameProvider>
  )
}
