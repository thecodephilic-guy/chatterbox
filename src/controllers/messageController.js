import { messages } from "../models/messageModel.js";
import { db } from "../../config/db.js";
import { eq } from "drizzle-orm";

export const addMessage = async (req, res) => {
  try {
    //saving the data in the table:
    const messaggeData = await db.insert(messages).values(req.body).returning();

    return res.status(200).json(messaggeData[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getMessage = async (req, res) => {
  const chatId = req.params.chatId;

  // Validate that chatId are provided
  if (!chatId) return res.status(400).json("chatId is required");

  try {
    //retrieving all the messages based on chatId
    const allMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    return res.status(200).json(allMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
