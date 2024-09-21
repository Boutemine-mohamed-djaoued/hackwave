import { Router } from "express";
import userRouter from "./user.js";
import botRouter from "./bot.js"
import callsRouter from "./calls.js"
import transactionsRouter from "./transactions.js"
import ticketRouter from "./ticket.js"
const router = Router();

router.use("/user", userRouter);
router.use("/ai",botRouter)
router.use("/call",callsRouter)
router.use("/transaction",transactionsRouter)
router.use("/ticket",ticketRouter)

export default router;
