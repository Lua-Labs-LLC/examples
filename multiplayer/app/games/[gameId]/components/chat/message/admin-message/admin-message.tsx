import { AdminChatPayload, UserChatPayload } from "@/models/message";

export const AdminMessage = ({ payload }: { payload: AdminChatPayload }) => {
  return <div className="font-bold text-blue-400">{payload.message}</div>;
};
