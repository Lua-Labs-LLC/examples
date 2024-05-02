import { SessionTable } from "@repo/database/src/schemas/session.schema";
import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@repo/database/src/database";
import { UserTable } from "@repo/database/src/schemas/user.schema";

const adapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : undefined,
      domain:
        process.env.NODE_ENV === "production"
          ? ".sandbox.lualabs.xyz"
          : undefined,
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
