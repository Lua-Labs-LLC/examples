import { GameStatusMessage as GameStatusMessageType } from "@/models/message"

export const GameStatusMessage = ({
  message,
}: {
  message: GameStatusMessageType
}) => {
  const payload = message.payload
  return <div className="font-bold text-blue-400">{payload.message}</div>
}
