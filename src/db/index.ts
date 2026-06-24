import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL ni nastavljen. Dashboard bo za podatke potreboval Neon povezavo.");
}

const client = postgres(connectionString ?? "postgres://localhost:5432/nivo", {
  max: 1,
  prepare: false,
});

export const db = drizzle(client, { schema });
