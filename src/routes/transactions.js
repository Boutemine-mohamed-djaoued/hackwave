import { Router } from "express";
import transactions from "../controllers/transactions.js";

const router = Router();

router.get("/",transactions.getTransactions)

export default router