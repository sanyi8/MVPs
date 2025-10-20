import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Initialize postgres client with connection string from environment variable
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

// Initialize drizzle with the client and schema
export const db = drizzle(client, { schema });