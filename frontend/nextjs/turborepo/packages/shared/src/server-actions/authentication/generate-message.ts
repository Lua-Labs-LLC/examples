/* eslint-disable turbo/no-undeclared-env-vars */
"use server";
import { HexString } from "../../components/wagmi/types/hex-string";
import { serverActionWrapper } from "../../utils/server-action-wrapper";
import jwt from "jsonwebtoken";

export async function generateMessage(address: HexString) {
  return await serverActionWrapper(async () => {
    const message = {
      message: `Authentication Request: ${crypto.randomUUID().slice(0, 10)}`,
      address,
    };
    const token = jwt.sign(message, process.env.NEXTAUTH_JWT_SECRET as string, {
      expiresIn: 600,
    });
    return { token, message };
  });
}
