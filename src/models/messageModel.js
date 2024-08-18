import { pgTable, serial, integer, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { chats } from "./chatModel.js";
import {users} from "./user.js";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id).notNull(),  // Foreign key to chats table
  senderId: integer("sender_id").references(() => users.id).notNull(),  // Foreign key to users table
  content: text("content"),  // Message content (could be null if it's a media-only message)
  messageType: varchar("message_type", { length: 50 }).default('text'),  // Type of message (e.g., text, image, video)
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});
