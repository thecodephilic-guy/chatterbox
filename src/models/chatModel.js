import { pgTable, serial, integer, timestamp, } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").references(() => users.id).notNull(),  // First user in the chat
  user2Id: integer("user2_id").references(() => users.id).notNull(),  // Second user in the chat
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
