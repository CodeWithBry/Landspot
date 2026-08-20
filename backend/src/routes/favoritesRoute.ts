import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorites.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/get-favorites", requireAuth, getFavorites);
router.get("/add/:listing_id", requireAuth, addFavorite);
router.get("/remove/:listing_id", requireAuth, removeFavorite);
export default router;