import express from "express";
import { createChat, userChats, findChat } from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/create", createChat)
router.get("/:userId", userChats)
router.get("/find/:user1Id/:user2Id", findChat)

export default router