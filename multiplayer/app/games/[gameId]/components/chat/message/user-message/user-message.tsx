"use client";

import { UserChatPayload } from "@/models/message";
import { AppContext } from "@/providers/app-provider";
import { useContext } from "react";

export const UserMessage = ({ payload }: { payload: UserChatPayload }) => {
  const { userId } = useContext(AppContext);
  if (userId === payload.userId) {
    return (
      <div className="ml-auto text-black   rounded-full">{payload.message}</div>
    );
  }
  return <div className="w-fit text-black rounded-full">{payload.message}</div>;
};
