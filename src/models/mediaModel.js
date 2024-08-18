import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { messages } from "./messageModel.js";

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id).notNull(),  // Foreign key to messages table
  fileName: varchar("file_name", { length: 255 }).notNull(),  // Name of the file
  fileType: varchar("file_type", { length: 50 }).notNull(),  // Type of file (e.g., image, video)
  fileUrl: varchar("file_url", { length: 255 }).notNull(),  // URL where the file is stored
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});
