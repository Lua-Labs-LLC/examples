import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NEXTAUTH_JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
  },
  client: {},
  runtimeEnv: {
    NEXTAUTH_JWT_SECRET: process.env.NEXTAUTH_JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
})
