"use server";

import { validateRequest } from "@repo/auth/src/auth-guard";
import { lucia } from "@repo/auth/src/lucia";
import { serverActionWrapper } from "../../utils/server-action-wrapper";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function logout() {
  return await serverActionWrapper(async () => {
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
  });
}
