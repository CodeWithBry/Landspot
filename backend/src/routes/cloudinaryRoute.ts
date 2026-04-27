import { Router } from "express";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadFiles } from "../controllers/cloudinary.controller";
import { deleteImage } from "../services/cloudinaryServices";

const router = Router();

router.post('/upload', requireAuth, requireRole('agent'), uploadFiles);
router.delete('/delete', requireAuth, requireRole('agent'), deleteImage);

export default router; 