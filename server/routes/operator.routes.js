import express from "express";
import {
  freeUpSeats,
  getOperatorBookings,
  getOperatorFleet,
  getOperatorProfile,
  updateOperator,
  updateOperatorBus,
} from "../controllers/operator.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Operators
 *   description: Operator management
 */

/**
 * @swagger
 * /operators/{id}:
 *   get:
 *     summary: Get operator profile
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Operator profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operator'
 *       404:
 *         description: Operator not found
 */
router.get("/:id", authenticate, getOperatorProfile);

/**
 * @swagger
 * /operators/{id}:
 *   put:
 *     summary: Update operator profile
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operator ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operator'
 *     responses:
 *       200:
 *         description: Operator updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Operator not found
 */
router.put("/:id", authenticate, updateOperator);

/**
 * @swagger
 * /operators/{id}/fleet:
 *   get:
 *     summary: Get operator's fleet
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: List of buses in the fleet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 *       404:
 *         description: Operator not found
 */
router.get("/:id/fleet", authenticate, getOperatorFleet);

/**
 * @swagger
 * /operators/{operatorId}/fleet/{busId}:
 *   put:
 *     summary: Update a bus in operator's fleet
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: operatorId
 *         schema:
 *           type: string
 *         required: true
 *         description: Operator ID
 *       - in: path
 *         name: busId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Operator or bus not found
 */
router.put("/:operatorId/fleet/:busId", updateOperatorBus);

/**
 * @swagger
 * /operators/fleet/{busId}/free-up:
 *   post:
 *     summary: Free up seats on a bus
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: busId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of seat numbers to free up
 *     responses:
 *       200:
 *         description: Seats freed successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Bus not found
 */
router.post("/fleet/:busId/free-up", freeUpSeats);

/**
 * @swagger
 * /operators/{id}/bookings:
 *   get:
 *     summary: Get operator's bookings
 *     tags: [Operators]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Operator not found
 */
router.get("/:id/bookings", getOperatorBookings);

export default router;
