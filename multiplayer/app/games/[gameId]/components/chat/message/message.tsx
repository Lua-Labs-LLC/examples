import { ChatMessage } from "@/models/message";
import { UserMessage } from "./user-message/user-message";
import { AdminMessage } from "./admin-message/admin-message";

export const Message = ({ message }: { message: ChatMessage }) => {
  switch (message.payload.type) {
    case "User":
      return <UserMessage payload={message.payload} />;
    case "Admin":
      return <AdminMessage payload={message.payload} />;
  }
};
