const express = require("express");
const router = express.Router();
const poolController = require("../controllers/poolController");

// Create a new carpool request
router.post("/create", poolController.createCarpoolRequest);

// Get all carpool requests
router.get("/", poolController.getAllCarpoolRequests);

// Get a specific carpool request by ID
// router.get("/:id", poolController.getCarpoolRequestById);

// Update a carpool request
router.put("/:id", poolController.updateCarpoolRequest);

// Delete a carpool request
// router.delete("/:id", poolController.deleteCarpoolRequest);

// Join a carpool request
router.post("/:id/join", poolController.joinCarpoolRequest);

// Leave a carpool request
router.post("/:id/leave", poolController.closeCarpoolRequest);

module.exports = router;
