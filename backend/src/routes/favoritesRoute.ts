import { Router } from "express";
import { requireRole } from "../middleware/roleGuard";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorites.controller";

const router = Router();

router.post("/get-favorites", getFavorites);
router.post("/add", addFavorite);
router.post("/remove", removeFavorite);
export default router;