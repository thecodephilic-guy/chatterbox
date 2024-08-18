import express from "express";
import { addMessage, getMessage} from "../controllers/messageController.js"


const router = express.Router();

router.post('/add', addMessage);
router.get('/:chatId', getMessage);


export default router;