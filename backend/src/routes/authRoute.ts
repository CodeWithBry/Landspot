import { Router } from "express";
import { getUser, login, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', requireAuth, getUser);
router.get('/test', async (req, res) => {
    res.send("TESTING")
})

export default router;