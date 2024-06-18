"use client";

import { acceptGame } from "@/server-actions/games/accept-game";
import { Button } from "./ui/button";

export const AcceptGame = ({ gameId }: { gameId: string }) => {
  const action = async () => {
    await acceptGame(gameId);
  };
  return <Button onClick={() => action()}>Accept Game</Button>;
};
