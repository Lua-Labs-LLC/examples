"use client"

import { UserMessage as UserMessageType } from "@/models/message"
import { AppContext } from "@/providers/app-provider"
import { useContext } from "react"

export const UserMessage = ({ message }: { message: UserMessageType }) => {
  const { userId } = useContext(AppContext)
  const payload = message.payload
  if (userId === payload.userId) {
    return (
      <div className="ml-auto rounded-full text-black">{payload.message}</div>
    )
  }
  return <div className="w-fit rounded-full text-black">{payload.message}</div>
}
