import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from 'dotenv';

dotenv.config({path: ".env"})

const sql = postgres(process.env.DATABASE_URL, { max: 1 })
const db = drizzle(sql);
await migrate(db, { migrationsFolder: "./migrations" });
await sql.end();