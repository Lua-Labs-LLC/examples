"use server"
import { HexString } from "@/components/shared/wagmi/types/hex-string"
import { env } from "@/env.mjs"
import { serverActionWrapper } from "@/utils/server-action-wrapper"
import jwt from "jsonwebtoken"

export async function generateMessage(address: HexString) {
  return await serverActionWrapper(async () => {
    const message = {
      message: `Authentication Request: ${crypto.randomUUID().slice(0, 10)}`,
      address,
    }
    const token = jwt.sign(message, env.NEXTAUTH_JWT_SECRET, {
      expiresIn: 600,
    })
    return { token, message }
  })
}
