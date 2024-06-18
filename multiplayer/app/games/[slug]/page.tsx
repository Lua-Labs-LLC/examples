import { getUser } from "@/auth/auth-guard";
import Chat from "@/components/chat";
import { JoinGame } from "@/components/join-game";
import { Button } from "@/components/ui/button";
import { getGameById } from "@/server-actions/games/get-game-by-id";
import { joinGame } from "@/server-actions/games/join-game";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Resource } from "sst";

export default async function Game({ params }: { params: { slug: string } }) {
  const game = await getGameById(params.slug);
  const { sessionId } = await getUser();
  if (!sessionId) redirect("/");
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <JoinGame gameId={params.slug}></JoinGame>

      <Link href="/games">Back</Link>
      <h1 className="text-7xl">Game ${game.gameId}</h1>
      <Chat
        endpoint={Resource.MyRealtime.endpoint}
        authorizer={Resource.MyRealtime.authorizer}
        topic={`${Resource.App.name}/${Resource.App.stage}/${params.slug}`}
        token={sessionId}
        gameId={params.slug}
        chatHistory={game["chatHistory"]}
      />
    </div>
  );
}
