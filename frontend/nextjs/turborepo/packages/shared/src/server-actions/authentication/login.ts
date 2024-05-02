"use server";
import { serverActionWrapper } from "../../utils/server-action-wrapper";
import { revalidatePath } from "next/cache";
import { signInSignUp } from "./sign-in-sign-up";
import { verifySignature } from "./verify-signature";
export async function login(signature: `0x${string}`, token: string) {
  return await serverActionWrapper(async () => {
    const address = await verifySignature(signature, token);
    if (address) {
      await signInSignUp(address);
      revalidatePath("/");
    } else {
      throw new Error("Invalid Signature");
    }
  });
}
