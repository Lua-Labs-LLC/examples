import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { UserTable } from "./user.schema";

// Wallet table
// Remove unique from walletAddress to allow users to connect multiple wallets to their account
export const WalletTable = pgTable("wallet", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => UserTable.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
});
