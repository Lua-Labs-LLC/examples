import { getGameById } from "@/server-actions/games/get-game-by-id";

export default async function Game({ params }: { params: { slug: string } }) {
  const game = await getGameById(params.slug);
  return <>`Game ${game["gameId"]}`</>;
}
