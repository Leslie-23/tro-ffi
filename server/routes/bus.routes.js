import express from "express";
import {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
} from "../controllers/bus.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllBuses);
router.get("/:id", getBusById);
router.post("/", authenticate, createBus);
router.put("/:id", authenticate, updateBus);
router.delete("/:id", authenticate, deleteBus);

export default router;
