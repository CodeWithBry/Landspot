import { Router } from "express";
import { getMailById, getMails, getUnseenMailsLength } from "../controllers/mails.controller";
import { sendMail } from "../controllers/mails.controller"
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();


router.post("/send-mail", requireAuth, sendMail);
router.get("/get-mails", requireAuth, getMails);
router.get("/get-mail-by-id/:mail_id", getMailById);
router.get("/unseen-mails-length", requireAuth, getUnseenMailsLength);
// router.delete("/delete-mail", );

export default router;