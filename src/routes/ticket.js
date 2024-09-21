import {Router} from "express"
import ticket from "../controllers/ticket.js";

const router = Router()

router.post("/",ticket.createTicket)
router.post("/close",ticket.closeTicket)

export default router;