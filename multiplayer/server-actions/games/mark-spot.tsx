"use server"
import { getUser } from "@/auth/auth-guard"
import { getCurrentUnixTimestamp } from "@/lib/unix-timestamp"
import { sendMessage } from "../messages/send-message"

export const markSpot = async (
  gameId: string,
  move: { index: number; player: "X" | "O" }
) => {
  const { userId } = await getUser()
  if (!userId) throw new Error(`PERMISSION DENIED`)

  try {
    await sendMessage(
      {
        type: "GameAction",
        payload: {
          userId,
          location: move.index,
          type: move.player,
          timestamp: getCurrentUnixTimestamp(),
        },
      },
      gameId
    )
    console.log("Move saved successfully to DynamoDB")
  } catch (error) {
    console.error("Error saving move to DynamoDB:", error)
    throw new Error(`Failed to save move: ${error}`)
  }
}
