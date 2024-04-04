"use server"
import { lucia } from "@/auth/lucia"
import { db } from "@/database/database"
import { UserTable } from "@/database/schemas/user.schema"
import { WalletTable } from "@/database/schemas/wallet.schema"
import { and, eq } from "drizzle-orm"
import { generateId } from "lucia"
import { cookies } from "next/headers"
import "server-only"

export async function signInSignUp(walletAddress: string) {
  let userId
  const [existingWallet] = await db
    .select()
    .from(WalletTable)
    .where(and(eq(WalletTable.walletAddress, walletAddress)))
  if (existingWallet?.userId) {
    userId = existingWallet.userId
  } else {
    userId = generateId(15)
    await db.insert(UserTable).values({
      id: userId,
    })
    await db.insert(WalletTable).values({
      userId,
      walletAddress,
    })
  }
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}
