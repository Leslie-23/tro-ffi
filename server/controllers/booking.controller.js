import {
  createBooking,
  findBookingsByUser,
  findBookingById,
  cancelBookingById,
  updateBooking,
} from "../models/Booking.js";
import pool from "../config/database.js";
const connection = await pool.getConnection();
// Create a new booking
export const createBookingController = async (req, res) => {
  try {
    const {
      user_id,
      route_id,
      bus_id,
      pickup_location_id,
      dropoff_location_id,
      pickup_time,
      fare,
      payment_method,
      passenger_count,
    } = req.body;

    if (
      !user_id ||
      !route_id ||
      !bus_id ||
      !pickup_location_id ||
      !dropoff_location_id ||
      !pickup_time ||
      !fare ||
      !payment_method
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const [bus] = await connection.query(
      `SELECT capacity, current_occupancy 
       FROM buses WHERE id = ? FOR UPDATE`,
      [bus_id]
    );

    if (!bus.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Bus not found" });
    }

    const newOccupancy = bus[0].current_occupancy + passenger_count;
    if (newOccupancy > bus[0].capacity) {
      await connection.rollback();
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // 2. Update bus occupancy
    await connection.query(
      `UPDATE buses 
       SET current_occupancy = ? 
       WHERE id = ?`,
      [newOccupancy, bus_id]
    );
    const bookingId = await createBooking({
      user_id,
      route_id,
      bus_id,
      pickup_location_id,
      dropoff_location_id,
      pickup_time,
      fare,
      payment_method,
      passenger_count,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking_id: bookingId,
      bus_occupancy: newOccupancy,

      ...req.body,
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      err: error.stack,
      message: error.message,
    });
  }
};

// Get all bookings for a user
export const getUserBookingsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await findBookingsByUser(userId);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetching bookings failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single booking by ID
export const getBookingByIdController = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await findBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Fetching booking failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBookingController = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const bookingId = req.params.id;
    const userId = req.user.userId;
    const { passenger_count: newPassengerCount } = req.body;

    // 1. Get existing booking with lock
    const [booking] = await connection.query(
      `SELECT * FROM bookings 
       WHERE id = ? AND user_id = ? FOR UPDATE`,
      [bookingId, userId]
    );

    if (!booking.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not found" });
    }

    const currentBooking = booking[0];
    const passengerDiff = newPassengerCount - currentBooking.passenger_count;

    // 2. Only process if passenger count changes
    if (passengerDiff !== 0) {
      // 3. Get and lock bus record
      const [bus] = await connection.query(
        `SELECT capacity, current_occupancy 
         FROM buses WHERE id = ? FOR UPDATE`,
        [currentBooking.bus_id]
      );

      const newOccupancy = bus[0].current_occupancy + passengerDiff;

      // 4. Validate new occupancy
      if (newOccupancy < 0 || newOccupancy > bus[0].capacity) {
        await connection.rollback();
        return res.status(400).json({
          message: `Invalid passenger count. Available seats: ${bus[0].capacity - bus[0].current_occupancy}`,
        });
      }

      // 5. Update bus occupancy
      await connection.query(
        `UPDATE buses 
         SET current_occupancy = ? 
         WHERE id = ?`,
        [newOccupancy, currentBooking.bus_id]
      );
    }

    // 6. Update booking record
    const result = await updateBooking(bookingId, req.body, connection);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Update failed" });
    }

    await connection.commit();
    return res.status(200).json({
      message: "Booking updated successfully",
      bookingId,
      seatsChanged: passengerDiff,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Update failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    connection.release();
  }
};

// Cancel a booking (soft delete)
export const cancelBookingController = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const bookingId = req.params.id;
    const userId = req.user.userId;

    // 1. Get booking details with lock
    const [booking] = await connection.query(
      `SELECT * FROM bookings 
       WHERE id = ? AND user_id = ? FOR UPDATE`,
      [bookingId, userId]
    );

    if (!booking.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not found" });
    }

    const currentBooking = booking[0];

    // 2. Check if already cancelled
    if (currentBooking.status === "cancelled") {
      await connection.rollback();
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // 3. Update booking status and payment status
    const [updateResult] = await connection.query(
      `UPDATE bookings 
       SET status = 'pending',
           payment_status = 'failed',
           cancelled_at = CURRENT_TIMESTAMP()
       WHERE id = ?`,
      [bookingId]
    );

    // 4. Update bus occupancy
    await connection.query(
      `UPDATE buses 
       SET current_occupancy = GREATEST(current_occupancy - ?, 0)
       WHERE id = ?`,
      [currentBooking.passenger_count, currentBooking.bus_id]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not updated" });
    }

    await connection.commit();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      details: {
        bookingId,
        cancelledAt: new Date().toISOString(),
        seatsFreed: currentBooking.passenger_count,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Cancel booking failed:", error);
    return res.status(500).json({
      message: "Cancellation failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    connection.release();
  }
};
