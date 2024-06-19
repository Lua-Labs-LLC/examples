"use server";

import { sendMessage } from "./send-message";
import { getGameById } from "../games/get-game-by-id";
import { getUser } from "@/auth/auth-guard";
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp";
import { revalidatePath } from "next/cache";

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
      revalidatePath("/");
    } else {
      throw Error("PERMISSION DENIED");
    }
  } catch (error) {
    console.error("Failed to publish message:", error);
  }
};
