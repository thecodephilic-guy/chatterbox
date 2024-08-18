//function of authService is typically same as controllers but as it is a feature so creating it seprately
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { users } from "../src/models/user.js";
import { eq } from "drizzle-orm";

dotenv.config({ path: "../.env" });

export const registerUser = async (req, res, next) => {
  try {
    const { name, username, password, gender } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (
      name.length === 0 ||
      username.length === 0 ||
      password.length === 0 ||
      gender.length === 0
    )
      return res.status(400).json("All fields are required");

    if (user.length !== 0)
      return res.status(400).json("Username Already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db
      .insert(users)
      .values({
        name,
        username,
        password: hashedPassword,
        gender,
      })
      .returning();

    return res.status(201).json({
      uid: newUser[0].id,
      name: newUser[0].name,
      username: newUser[0].username,
      gender: newUser[0].gender,
      createdAt: newUser[0].createdAt,
      updatedAt: newUser[0].updatedAt,
      isOnline: newUser[0].isOnline,
      lastSeen: newUser[0].lastSeen,
    });
  } catch (error) {
    res.status(500).json(error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    console.log(user[0]);

    if (user.length === 0) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      user: {
        id: user[0].id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    return res.status(201).json({
      token: token,
      uid:user[0].id,
      name: user[0].name,
      username: user[0].username,
      gender: user[0].gender,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
      isOnline: user[0].isOnline,
      lastSeen: user[0].lastSeen,
    });
  } catch (error) {
    return res.status(500).json("Invalid credentials");
  }
};
