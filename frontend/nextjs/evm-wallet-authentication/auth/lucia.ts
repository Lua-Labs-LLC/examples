import { SessionTable } from "@/database/schemas/session.schema";
import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/database/database";
import { UserTable } from "@/database/schemas/user.schema";

// Create a new adapter to work with Drizzle
const adapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable);

// Configure options here for sessionExpiresIn, sessionCookie, getSessionAttributes, getUserAttributes
export const lucia = new Lucia(adapter);

// Register any DatabaseSessionAttributes or DatabaseUserAttributes
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
