import { Router } from "express";
import { follow, getProfile, getUser, getUsers, login, logOut, register, unFollow, updateProfile } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logOut);
router.get('/get-user', requireAuth, getUser);
router.get('/get-profile', requireAuth, getProfile);
router.post('/get-users', getUsers);
router.post('/update-profile', requireAuth, updateProfile);
router.post('/follow', follow);
router.post('/unfollow', unFollow);

export default router;