"use client";

import { createGame } from "@/server-actions/games/create-game";
import { Button } from "./ui/button";

export const CreateGame = () => {
  const action = async () => {
    await createGame();
  };
  return <Button onClick={() => action()}>Create Game</Button>;
};
