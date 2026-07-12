import { Router } from "express";
import { getNotificationById, getNotifications } from "../controllers/notifications.controller";
import { sendMail } from "../controllers/notifications.controller"
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();


router.post("/send-mail", requireAuth, sendMail);
router.post("/get-notifs", getNotifications);
router.get("/get-notif-by-id/:id", getNotificationById);
// router.delete("/delete-notifs", );

export default router;