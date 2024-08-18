import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({path: ".env"})

export default defineConfig({
  schema: './src/models',
  out: './migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});