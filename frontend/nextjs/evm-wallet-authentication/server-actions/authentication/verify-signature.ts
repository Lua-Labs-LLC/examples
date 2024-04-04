"use server"

import { HexString } from "@/components/shared/wagmi/types/hex-string"
import { env } from "@/env.mjs"
import jwt from "jsonwebtoken"
import "server-only"
import { verifyMessage } from "viem"

export async function verifySignature(signature: HexString, token: string) {
  const isValidJwt = jwt.verify(token, env.NEXTAUTH_JWT_SECRET)
  if (!isValidJwt) {
    throw new Error("Unauthorized")
  }
  const { iat, exp, ...message } = jwt.decode(token) as jwt.JwtPayload
  const verified = await verifyMessage({
    address: message.address,
    message: message.message,
    signature,
  })

  if (!verified) {
    return undefined
  } else {
    return message.address
  }
}
