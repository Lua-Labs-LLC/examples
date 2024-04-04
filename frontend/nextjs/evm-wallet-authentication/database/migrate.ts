import { migrate } from "drizzle-orm/aws-data-api/pg/migrator";
import { db } from "./database";

const runMigrate = async () => {
  console.log("⏳ Running migration...");
  await migrate(db, { migrationsFolder: "database/migrations" });
  console.log("Migration completed!");
  process.exit(0);
};

runMigrate().catch((error) => {
  console.error("Migration failed");
  console.error(error);
  process.exit(1);
});
