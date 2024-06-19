import { getUser } from "@/auth/auth-guard";
import { AcceptGame } from "@/components/accept-game";
import Chat from "./components/chat/chat";
import { JoinGame } from "@/components/join-game";
import { getGameById } from "@/server-actions/games/get-game-by-id";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Resource } from "sst";
import { TicTacToe } from "./components/tic-tac-toe/tic-tac-toe";
import { Button } from "@/components/ui/button";

export default async function Game({ params }: { params: { gameId: string } }) {
  const game = await getGameById(params.gameId);
  const { sessionId, userId } = await getUser();
  if (!sessionId) redirect("/");
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <Link className="mr-auto" href="/games">
        <Button variant="outline">Back</Button>
      </Link>
      <h1 className="text-7xl">Tic Tac Toe</h1>
      {!game.secondPlayerId && game.initiatorId !== userId && (
        <JoinGame gameId={params.gameId}></JoinGame>
      )}
      {game.status === "Waiting" && game.initiatorId === userId && (
        <AcceptGame gameId={params.gameId}></AcceptGame>
      )}
      <div className="flex flex-row w-full items-center justify-center gap-4">
        <TicTacToe></TicTacToe>
        <Chat
          endpoint={Resource.MyRealtime.endpoint}
          authorizer={Resource.MyRealtime.authorizer}
          topic={`${Resource.App.name}/${Resource.App.stage}/${params.gameId}`}
          token={sessionId}
          gameId={params.gameId}
          chatHistory={game.chatHistory}
        />
      </div>
    </div>
  );
}
