"use client";

import { useContext } from "react";
import { GameContext } from "../../game-provider";
import { JoinGame } from "@/components/join-game";
import { AcceptGame } from "@/components/accept-game";
import { AppContext } from "@/providers/app-provider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

export const GameControls = () => {
  const { game } = useContext(GameContext);
  const { userId } = useContext(AppContext);
  return (
    <>
      {game.status === "Created" &&
        !game.secondPlayerId &&
        game.initiatorId !== userId && (
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  <JoinGame gameId={game.gameId}></JoinGame>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      {game.status === "Waiting" && game.initiatorId === userId && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <AcceptGame gameId={game.gameId}></AcceptGame>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
