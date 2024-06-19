"use server";

import { sendMessage } from "./send-message";
import { getGameById } from "../games/get-game-by-id";
import { getUser } from "@/auth/auth-guard";
import { Message, MessageType } from "@/models/message";
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp";

export const userSendMessage = async (message: string, gameId: string) => {
  const { userId } = await getUser();
  try {
    const game = await getGameById(gameId);
    if (game.initiatorId === userId || game.secondPlayerId === userId) {
      await sendMessage(
        {
          type: "User",
          payload: {
            message,
            timestamp: getCurrentUnixTimestamp(),
            userId,
          },
        },
        gameId
      );
    } else {
      throw Error("PERMISSION DENIED");
    }
  } catch (error) {
    console.error("Failed to publish message:", error);
  }
};
