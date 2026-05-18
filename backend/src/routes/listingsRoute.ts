import { Router } from "express";
import { getAgentListing, createNewListing, getListings, testAddress, loadListings, getListingById, searchListings, deleteListing, deleteFromListingImages, udpateListing } from "../controllers/listings.controllers";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/get-listings", getListings);
router.post("/get-listing-by-id", getListingById);
router.post("/add-listing", requireAuth, requireRole('agent'), createNewListing);
router.post("/my-listing", getAgentListing); 
router.post("/test-address", testAddress);
router.post("/load-listings", loadListings);
router.post("/delete-list/:params", requireAuth, requireRole('agent'), deleteListing);
router.get("/search/:params", searchListings);
router.post("/update-listing", requireAuth, requireRole('agent'), udpateListing)
router.post("/delete-image/:id", requireAuth, requireRole("agent"), deleteFromListingImages);


export default router;