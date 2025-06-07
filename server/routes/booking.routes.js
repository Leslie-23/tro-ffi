import express from "express";
import {
  createBookingController,
  getUserBookingsController,
  getBookingByIdController,
  cancelBookingController,
  updateBookingController,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/bookings", authenticate, createBookingController);
router.get("/bookings/user/:userId", authenticate, getUserBookingsController);
router.get("/bookings/:id", authenticate, getBookingByIdController);
router.patch("/bookings/:id/cancel", authenticate, cancelBookingController);
router.put("/bookings/:id", authenticate, updateBookingController);

export default router;
