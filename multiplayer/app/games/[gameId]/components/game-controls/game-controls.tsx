"use client";

import { useContext } from "react";
import { GameContext } from "../../game-provider";
import { JoinGame } from "@/components/join-game";
import { AcceptGame } from "@/components/accept-game";
import { AppContext } from "@/providers/app-provider";

export const GameControls = () => {
  const { game } = useContext(GameContext);
  const { userId } = useContext(AppContext);
  return (
    <>
      {!game.secondPlayerId && game.initiatorId !== userId && (
        <JoinGame gameId={game.gameId}></JoinGame>
      )}
      {game.status === "Waiting" && game.initiatorId === userId && (
        <AcceptGame gameId={game.gameId}></AcceptGame>
      )}
    </>
  );
};
