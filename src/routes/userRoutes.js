import express from "express";
import { searchUser, getUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/:username", searchUser)
router.get("/by/:id", getUser)

export default router;