import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";

export const db = drizzle(new RDSDataClient({}), {
  database: process.env.DATABASE_NAME as string,
  secretArn: process.env.DATABASE_SECRET_ARN as string,
  resourceArn: process.env.DATABASE_RESOURCE_ARN as string,
});
