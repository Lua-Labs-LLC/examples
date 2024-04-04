import type { Config } from "drizzle-kit"
import { env } from "./env.mjs"

export default {
  schema: "./database/schemas",
  out: "./database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config
