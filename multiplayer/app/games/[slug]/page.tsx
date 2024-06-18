import { getUser } from "@/auth/auth-guard";
import { AcceptGame } from "@/components/accept-game";
import Chat from "@/components/chat";
import { JoinGame } from "@/components/join-game";
import { getGameById } from "@/server-actions/games/get-game-by-id";
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
      <AcceptGame gameId={params.slug}></AcceptGame>
      <Link href="/games">Back</Link>
      <h1 className="text-7xl">Game ${game.gameId}</h1>
      <Chat
        endpoint={Resource.MyRealtime.endpoint}
        authorizer={Resource.MyRealtime.authorizer}
        topic={`${Resource.App.name}/${Resource.App.stage}/${params.slug}`}
        token={sessionId}
        gameId={params.slug}
        chatHistory={game.chatHistory}
      />
    </div>
  );
}
