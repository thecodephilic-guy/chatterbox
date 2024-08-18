import { db } from "../../config/db.js";
import { users } from "../models/user.js";
import { eq } from "drizzle-orm";

export const searchUser = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length !== 0)
      return res.status(201).json({
        uid: user[0].id,
        name: user[0].name,
        username: user[0].username,
        gender: user[0].gender,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
        isOnline: user[0].isOnline,
        lastSeen: user[0].lastSeen,
      });

    return res.status(400).json('No user found')
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (user.length !== 0)
      return res.status(201).json({
        id: user[0].id,
        name: user[0].name,
        username: user[0].username,
        gender: user[0].gender,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
        isOnline: user[0].isOnline,
        lastSeen: user[0].lastSeen,
      });

    return res.status(400).json('No user found')
  } catch (error) {
    console.error(error);
    next(error);
  }
};
