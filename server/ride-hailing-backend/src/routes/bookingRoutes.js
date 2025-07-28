const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

// Create a new booking
router.post("/", bookingController.createBooking);

// Create carpool req
// router.post("/", bookingController.createCarpoolRequest);

// Get all bookings for a user
router.get("/user/:userId", bookingController.getUserBookings);

// Update a booking status
router.put("/:bookingId/status", bookingController.updateBookingStatus);

// Get booking details by ID
router.get("/:bookingId", bookingController.getUserBookings);

// Delete a booking
router.delete("/:bookingId", bookingController.deleteBooking);

// Export the router
module.exports = router;
