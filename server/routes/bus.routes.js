import express from "express";
import {
  createBus,
  deleteBus,
  getAllBuses,
  getBusById,
  updateBus,
} from "../controllers/bus.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Bus resource management
 */

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of all available buses
 *       500:
 *         description: Server error
 */
router.get("/", getAllBuses);
/**
 * @swagger
 * /buses/{id}:
 *   get:
 *     summary: Get bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bus to retrieve
 *     responses:
 *       200:
 *         description: Bus found
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Server error
 */

router.get("/:id", getBusById);
/**
 * @swagger
 * /buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - capacity
 *               - model
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: GR-1234-24
 *               capacity:
 *                 type: integer
 *                 example: 45
 *               model:
 *                 type: string
 *                 example: Yutong Bus
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createBus);

/**
 * @swagger
 * /buses/{id}:
 *   put:
 *     summary: Update an existing bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bus to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: GR-1234-24
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               model:
 *                 type: string
 *                 example: Benz Sprinter
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bus not found
 */

router.put("/:id", authenticate, updateBus);
/**
 * @swagger
 * /buses/{id}:
 *   delete:
 *     summary: Delete a bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bus to delete
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bus not found
 */
router.delete("/:id", authenticate, deleteBus);

export default router;
