import { Router } from "express";
import chatbot from "../controllers/chatbot.js";

const router = Router();

router.post("/faq",chatbot.FAQAi)

export default router;
