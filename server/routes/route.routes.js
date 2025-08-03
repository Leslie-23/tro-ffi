import express from "express";
import {
  createRoute,
  deleteRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
} from "../controllers/route.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", authenticate, createRoute);
router.put("/:id", authenticate, updateRoute);
router.delete("/:id", authenticate, deleteRoute);

export default router;
