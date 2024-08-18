import { eq, sql } from "drizzle-orm";
import { chats } from "../models/chatModel.js";
import { db } from "../../config/db.js";

export const createChat = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;
    

    //making sure that it is a new chat:
    const chat = await db
      .select()
      .from(chats)
      .where(
        sql`${chats.user1Id} = ${user1Id} and ${chats.user2Id} = ${user2Id}`
      );

    if (chat.length !== 0)
      return res.status(400).json("Can't create chat as chat already found");

    //creating a new chat and returning the info
    const newChat = await db
      .insert(chats)
      .values({
        user1Id,
        user2Id,
      })
      .returning();

    return res.status(200).json(newChat[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    //retrieving all the chats with a given userId:
    const userChats = await db
      .select()
      .from(chats)
      .where(sql`${chats.user1Id} = ${userId} or ${chats.user2Id} = ${userId}`);

    //handling if no chats found then based on response the client can be programed to create a new chat
    if (userChats.length === 0) return res.status(400).json("No chats found");

    return res.status(200).json(userChats);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const user1Id = req.params.user1Id;
    const user2Id = req.params.user2Id;

    // Validate that both user1Id and user2Id are provided
    if (!user1Id || !user2Id) {
      return res.status(400).json("Both user1Id and user2Id are required");
    }

    // Query the database to find the chat between user1Id and user2Id
    const userChat = await db
      .select()
      .from(chats)
      .where(
        sql`${chats.user1Id} IN (${user1Id}, ${user2Id}) 
          OR ${chats.user2Id} IN (${user1Id}, ${user2Id})`
      );

    //handling if no chats found then based on response the client can be programed to create a new chat
    if (userChat.length === 0) return res.status(400).json("No chats found");

    // Send the result back as a JSON response
    return res.status(200).json(userChat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
