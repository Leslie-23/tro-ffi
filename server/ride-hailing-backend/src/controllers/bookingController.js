const Booking = require("../models/booking");
const Carpool = require("../models/carpool");
const User = require("../models/user");
const { matchingService } = require("../services/matchingService");
const { notificationService } = require("../services/notificationService");

// Create a new booking
exports.createBooking = async (req, res) => {
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
      is_group_booking,
    } = req.body;

    const newBooking = new Booking({
      id: generateUniqueId(),
      user_id,
      route_id,
      bus_id,
      pickup_location_id,
      dropoff_location_id,
      pickup_time,
      fare,
      payment_method,
      passenger_count,
      is_group_booking,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, status } = req.body;
    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

// Retrieve bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const bookings = await Booking.find({ user_id });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings", error });
  }
};

// delete user booking
exports.deleteBooking = async (req, res) => {
  try {
    const { user_id } = req.params;
    const bookings = await Booking.findByIdAndDelete({ user_id });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookings", error });
  }
};

// Create a carpool request
exports.createCarpoolRequest = async (req, res) => {
  try {
    const {
      user_id,
      pickup_location_id,
      dropoff_location_id,
      pickup_time,
      passenger_count,
    } = req.body;

    const newCarpool = new Carpool({
      id: generateUniqueId(),
      user_id,
      pickup_location_id,
      dropoff_location_id,
      pickup_time,
      passenger_count,
    });

    await newCarpool.save();
    res.status(201).json({
      message: "Carpool request created successfully",
      carpool: newCarpool,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating carpool request", error });
  }
};

// Match users with available carpools
exports.matchCarpool = async (req, res) => {
  try {
    const { pickup_location_id, dropoff_location_id, pickup_time } = req.body;
    const matches = await matchingService.findCarpoolMatches(
      pickup_location_id,
      dropoff_location_id,
      pickup_time
    );

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: "Error matching carpools", error });
  }
};

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
