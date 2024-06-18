"use client";

import { Button } from "./ui/button";
import { joinGame } from "@/server-actions/games/join-game";

export const JoinGame = ({ gameId }: { gameId: string }) => {
  const action = async () => {
    await joinGame(gameId);
  };
  return <Button onClick={() => action()}>Join Game</Button>;
};
