import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { sendMail } from "../controllers/nodemailer.controller"

const router = Router();

router.post("/send-mail", requireAuth, sendMail);

export default router;