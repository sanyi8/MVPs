import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Database migration script
async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  
  try {
    // Create database schema
    console.log("Running database migrations...");
    const db = drizzle(migrationClient, { schema });
    
    // This creates the tables directly from the schema definitions
    await db.execute(/* sql */ `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        cook_time TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        ingredients TEXT[] NOT NULL,
        instructions TEXT[] NOT NULL,
        notes TEXT,
        user_id INTEGER REFERENCES users(id)
      );
    `);
    
    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

// Run the migration
runMigration().catch(console.error);