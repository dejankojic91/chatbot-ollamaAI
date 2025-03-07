import express from "express";

import { authenticateUser } from "../middleware/auth";
import { chatWithOpenAI } from "../controllers/chatController";

const router = express.Router();

router.post("/", authenticateUser, chatWithOpenAI);
// router.get("/history", authenticateUser, getChatHistory);

export default router;
