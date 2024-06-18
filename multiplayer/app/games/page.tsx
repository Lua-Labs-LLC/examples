import { Button } from "@/components/ui/button";
import { getRecentGames } from "@/server-actions/games/get-recent-games";
import Link from "next/link";

export default async function Games() {
  const games = await getRecentGames();
  console.log(games);
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-7xl">Recent Games</h1>
        <ul className="flex flex-col items-center justify-center gap-4">
          {games.map((game) => {
            return (
              <Link key={game["gameId"]} href={`/games/${game["gameId"]}`}>
                <li>
                  <Button variant="outline">{game["gameId"]}</Button>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
}
