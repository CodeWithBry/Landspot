import { Router } from "express";
import { getAgentListing, createNewListing, getListings, testAddress, loadListings, getListingById, searchListings, deleteListing, deleteFromListingImages, getAgentById, loadListingInitially, getListingsOnBound, updateListing } from "../controllers/listings.controllers";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/get-listings", getListings);
router.post("/get-listing-by-id", getListingById);
router.post("/add-listing", requireAuth, requireRole('agent'), createNewListing);
router.post("/my-listing", getAgentListing); 
router.post("/test-address", testAddress);
router.get("/load-listings-initially", loadListingInitially);
router.post("/load-listings", loadListings);
router.post("/delete-list/:params", requireAuth, requireRole('agent'), deleteListing);
router.get("/search/:params", searchListings);
router.post("/update-listing", requireAuth, requireRole('agent'), updateListing)
router.post("/delete-image/:id", requireAuth, requireRole("agent"), deleteFromListingImages);
router.get("/get-agent/:agent_id", getAgentById);
router.post("/get-listings-onbound", getListingsOnBound);



export default router;