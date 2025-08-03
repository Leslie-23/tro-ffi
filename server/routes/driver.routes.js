import express from "express";
import {
  getAssignedBuses,
  getDriverBookings,
  getDriverProfile,
  updateDriverProfile,
  updateDriverStatus,
  verifyDriver,
} from "../controllers/driver.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/:id", getDriverProfile);
router.put("/:id", updateDriverProfile);
router.get("/:id/buses", getAssignedBuses);
router.get("/:id/bookings", getDriverBookings);
router.patch("/:id/status", updateDriverStatus);
router.patch("/:id/verify", verifyDriver);

export default router;
