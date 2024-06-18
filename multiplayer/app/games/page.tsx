import { getRecentGames } from "@/server-actions/games/get-recent-games";
import Link from "next/link";

export default async function Games() {
  const games = await getRecentGames();
  console.log(games);
  return (
    <>
      <h1>Games</h1>
      <div className="flex flex-col items-center justify-center">
        <ul>
          {games.map((game) => {
            return (
              <Link key={game["gameId"]} href={`/games/${game["gameId"]}`}>
                <li>{game["gameId"]}</li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
}
