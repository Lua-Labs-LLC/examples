/* eslint-disable turbo/no-undeclared-env-vars */
"use server";

import { HexString } from "../../components/wagmi/types/hex-string";

import jwt from "jsonwebtoken";
import "server-only";
import { verifyMessage } from "viem";

export async function verifySignature(signature: HexString, token: string) {
  const isValidJwt = jwt.verify(
    token,
    process.env.NEXTAUTH_JWT_SECRET as string
  );
  if (!isValidJwt) {
    throw new Error("Unauthorized");
  }
  // eslint-disable-next-line no-unused-vars
  const { iat, exp, ...message } = jwt.decode(token) as jwt.JwtPayload;
  const verified = await verifyMessage({
    address: message.address,
    message: message.message,
    signature,
  });

  if (!verified) {
    return undefined;
  } else {
    return message.address;
  }
}
