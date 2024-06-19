import { Suspense } from "react";
import { GameContainer } from "./components/game-container/game-container";

export default async function Game({ params }: { params: { gameId: string } }) {
  return (
    <>
      <Suspense fallback="loading">
        <GameContainer gameId={params.gameId} />
      </Suspense>
    </>
  );
}
