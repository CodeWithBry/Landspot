import { Router } from "express";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadFiles } from "../controllers/cloudinary.controller";
import { deleteImage } from "../services/cloudinaryServices";
import { upload } from "../middleware/cloudinary.middleware";

const router = Router();

router.post('/upload', requireAuth, requireRole('agent'), upload.array('images', 10), uploadFiles);
router.delete('/delete', requireAuth, requireRole('agent'), deleteImage);

export default router; 