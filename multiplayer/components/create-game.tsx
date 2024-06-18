"use client";

import { createGame } from "@/server-actions/games/create-game";

export const CreateGame = () => {
  const action = async () => {
    await createGame();
  };
  return <button onClick={() => action()}>Create Game</button>;
};
