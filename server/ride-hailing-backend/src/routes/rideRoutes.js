const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");

// Route to request a ride
router.post("/request", rideController.requestRide);

// Route to accept a ride request
router.post("/accept/:requestId", rideController.acceptRideRequest);

// Route to cancel a ride request
router.delete("/cancel/:requestId", rideController.cancelRide);

// Route to get ride status
router.get("/status/:rideId", rideController.getRideStatus);
router.put("/status/:rideId", rideController.updateRideStatus);

// Route to complete a ride
// router.post("/complete/:rideId", rideController.completeRide);

// Route to get ride history for a user
// router.get("/history/:userId", rideController.getRideHistory);

module.exports = router;
