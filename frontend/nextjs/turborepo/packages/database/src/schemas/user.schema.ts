import { pgTable, text } from "drizzle-orm/pg-core";

// User Table
export const UserTable = pgTable("user", {
  id: text("id").primaryKey(),
});
