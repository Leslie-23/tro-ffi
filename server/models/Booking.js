import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create a new booking
const createBooking = async (bookingData) => {
  const [result] = await pool.query(
    `INSERT INTO bookings 
     (id, user_id, route_id, bus_id, status, pickup_location_id, 
      dropoff_location_id, pickup_time, fare, payment_method, passenger_count) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      bookingData.user_id,
      bookingData.route_id,
      bookingData.bus_id,
      bookingData.status || "pending",
      bookingData.pickup_location_id,
      bookingData.dropoff_location_id,
      bookingData.pickup_time,
      bookingData.fare,
      bookingData.payment_method,
      bookingData.passenger_count || 1,
    ]
  );
  return result.insertId;
};

// Find all bookings by user
const findBookingsByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
      b.*, 
      r.name as route_name,
      bu.name as bus_name,
      pl.name as pickup_location,
      dl.name as dropoff_location
     FROM bookings b
     JOIN routes r ON b.route_id = r.id
     JOIN buses bu ON b.bus_id = bu.id
     JOIN locations pl ON b.pickup_location_id = pl.id
     JOIN locations dl ON b.dropoff_location_id = dl.id
     WHERE b.user_id = ?`,
    [userId]
  );
  return rows;
};

// Get single booking by ID
const findBookingById = async (bookingId) => {
  const [rows] = await pool.query(
    `SELECT 
      b.*, 
      r.name as route_name,
      bu.name as bus_name,
      pl.name as pickup_location,
      dl.name as dropoff_location
     FROM bookings b
     JOIN routes r ON b.route_id = r.id
     JOIN buses bu ON b.bus_id = bu.id
     JOIN locations pl ON b.pickup_location_id = pl.id
     JOIN locations dl ON b.dropoff_location_id = dl.id
     WHERE b.id = ?`,
    [bookingId]
  );
  return rows[0];
};

export const updateBooking = async (
  bookingId,
  updateData,
  connection = pool
) => {
  // Define allowed fields for update
  const allowedFields = [
    "pickup_location_id",
    "dropoff_location_id",
    "pickup_time",
    "passenger_count",
    "status",
  ];

  // Filter valid updates
  const validUpdates = {};
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      validUpdates[key] = updateData[key];
    }
  });

  // Add cancelled_at if status is being set to cancelled
  if (validUpdates.status === "cancelled") {
    validUpdates.cancelled_at = new Date();
  }

  const [result] = await connection.query(
    `UPDATE bookings 
     SET ?
     WHERE id = ?`,
    [validUpdates, bookingId]
  );

  return result;
};

// Cancel booking by setting status to 'cancelled'
const cancelBookingById = async (bookingId) => {
  const [result] = await pool.query(
    `UPDATE bookings SET status = ? WHERE id = ? AND status != ?`,
    ["cancelled", bookingId, "cancelled"]
  );
  return result;
};

// Export all functions
export {
  createBooking,
  findBookingsByUser,
  findBookingById,
  cancelBookingById,
};
