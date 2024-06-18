import { getUser } from "@/auth/auth-guard";
import Chat from "@/components/chat";
import { getGameById } from "@/server-actions/games/get-game-by-id";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Resource } from "sst";
const topic = "sst-chat";

export default async function Game({ params }: { params: { slug: string } }) {
  const game = await getGameById(params.slug);
  const { userId, sessionId } = await getUser();
  if (!sessionId) redirect("/");
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <Link href="/games">Back</Link>
      <h1 className="text-7xl">Game ${game.gameId}</h1>
      <Chat
        endpoint={Resource.MyRealtime.endpoint}
        authorizer={Resource.MyRealtime.authorizer}
        topic={`${Resource.App.name}/${Resource.App.stage}/${topic}`}
        token={sessionId}
        gameId={params.slug}
        chatHistory={game["chatHistory"]}
      />
    </div>
  );
}
