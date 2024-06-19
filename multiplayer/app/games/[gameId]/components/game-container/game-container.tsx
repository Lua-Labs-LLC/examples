import { getGameById } from "@/server-actions/games/get-game-by-id";
import GameProvider from "../../game-provider";
import Chat from "../chat/chat";
import { GameControls } from "../game-controls/game-controls";
import { TicTacToe } from "../tic-tac-toe/tic-tac-toe";
import { Resource } from "sst";
import { getUser } from "@/auth/auth-guard";

export const GameContainer = async ({ gameId }: { gameId: string }) => {
  const game = await getGameById(gameId);
  const topic = `${Resource.App.name}/${Resource.App.stage}/${game.gameId}`;
  const endpoint = Resource.MyRealtime.endpoint;
  const authorizer = Resource.MyRealtime.authorizer;
  const { sessionId } = await getUser();
  return (
    <GameProvider
      game={game}
      topic={topic}
      endpoint={endpoint}
      authorizer={authorizer}
      token={sessionId!}
    >
      <GameControls />
      <div className="flex flex-row w-full items-center justify-center gap-4">
        <TicTacToe />
        <Chat />
      </div>
    </GameProvider>
  );
};
