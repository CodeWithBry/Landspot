import { Router } from "express";
import { getAgentListing, createNewListing, getListings, testAddress, loadListings, getListingById, searchListings, deleteListing, deleteFromListingImages, getAgentById, loadListingInitially, getListingsOnBound, updateListing } from "../controllers/listings.controllers";
import { requireRole } from "../middleware/roleGuard";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/get-listings", getListings); // listings 
router.post("/get-listing-by-id", requireAuth, getListingById); // single-list
router.post("/add-listing", requireAuth, requireRole('agent'), createNewListing);
router.post("/my-listing", getAgentListing); 
router.post("/test-address", testAddress);
router.get("/load-listings-initially", requireAuth, loadListingInitially);
router.post("/load-listings", requireAuth, loadListings); // get listings in listing format
router.post("/delete-list/:params", requireAuth, requireRole('agent'), deleteListing);
router.get("/search/:params", searchListings);
router.post("/update-listing", requireAuth, requireRole('agent'), updateListing);
router.post("/delete-image/:id", requireAuth, requireRole("agent"), deleteFromListingImages);
router.get("/get-agent/:agent_id", getAgentById);
router.post("/get-listings-onbound", getListingsOnBound);



export default router;