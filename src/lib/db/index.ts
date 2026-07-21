import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Use Turso in production (Vercel), local SQLite file in development
const isProduction = process.env.TURSO_DATABASE_URL;

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:portfolio.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { schema };
