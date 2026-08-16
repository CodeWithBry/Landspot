import { Router } from "express";
import { getProfile, getUser, login, register, updateProfile } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', requireAuth, getUser);
router.get('/get-profile', requireAuth, getProfile);
router.post('/update-profile', requireAuth, updateProfile);

export default router;