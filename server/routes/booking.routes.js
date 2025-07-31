import express from "express";
import {
  cancelBookingController,
  createBookingController,
  getBookingByIdController,
  getUserBookingsController,
  updateBookingController,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking operations for users
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - serviceId
 *               - date
 *               - time
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64df34edcb0937b58a99f6d1"
 *               serviceId:
 *                 type: string
 *                 example: "64de1234cb0937b58a99f6aa"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-05"
 *               time:
 *                 type: string
 *                 example: "14:30"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       400:
 *         description: Validation error
 */

router.post("/bookings", authenticate, createBookingController);
/**
 * @swagger
 * /bookings/user/{userId}:
 *   get:
 *     summary: Get all bookings for a specific user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user bookings
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found or has no bookings
 */

router.get("/bookings/user/:userId", authenticate, getUserBookingsController);
/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details by booking ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get("/bookings/:id", authenticate, getBookingByIdController);
/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel an existing booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID to cancel
 *     responses:
 *       200:
 *         description: Booking canceled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */

router.patch("/bookings/:id/cancel", authenticate, cancelBookingController);
/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update an existing booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-12"
 *               time:
 *                 type: string
 *                 example: "16:00"
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put("/bookings/:id", authenticate, updateBookingController);

export default router;
