import { Router } from "express";
import { getAgentListing, createNewListing, getListings, testAddress, loadListings } from "../controllers/listings.controllers";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/get-listings", getListings);
router.post("/add-listing", requireAuth, requireRole('agent'), createNewListing);
router.post("/my-listing", getAgentListing); 
router.post("/test-address", testAddress);
router.post("/load-listings", loadListings);

export default router;