import { Router } from "express";
import { getNotificationById, getNotifications, getUnseenNotificationsLength } from "../controllers/notifications.controller";
import { sendMail } from "../controllers/notifications.controller"
import { requireAuth } from "../middleware/auth.middleware";
const router = Router();


router.post("/send-mail", requireAuth, sendMail);
router.post("/get-notifs", getNotifications);
router.get("/get-notif-by-id/:user_id", getNotificationById);
router.get("/unseen-notifs-length/:user_id", getUnseenNotificationsLength);
// router.delete("/delete-notifs", );

export default router;