import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { UserTable } from "./user.schema";

// Session Table
export const SessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
