import { ChatMessage } from "@/models/message"
import { GameStatusMessage } from "./game-status-message/game-status-message"
import { UserMessage } from "./user-message/user-message"

export const Message = ({ message }: { message: ChatMessage }) => {
  switch (message.type) {
    case "User":
      return <UserMessage message={message} />
    case "GameStatus":
      return <GameStatusMessage message={message} />
  }
}
