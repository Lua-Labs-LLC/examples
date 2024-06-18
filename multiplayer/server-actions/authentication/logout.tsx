"use server";

import { validateRequest } from "@/auth/auth-guard";
import { lucia } from "@/auth/lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error("Unauthorized");
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  revalidatePath("/");
}
