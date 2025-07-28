const Ride = require("../models/route"); // Assuming a Ride model exists
const Carpool = require("../models/carpool"); // Assuming a Carpool model exists
const User = require("../models/user");
const Driver = require("../models/driver");
const { matchingService } = require("../services/matchingService");
const { notificationService } = require("../services/notificationService");

// Request a ride
exports.requestRide = async (req, res) => {
  const { userId, pickupLocation, dropoffLocation, rideType } = req.body;

  try {
    const ride = await Ride.create({
      userId,
      pickupLocation,
      dropoffLocation,
      rideType,
      status: "requested",
    });

    res.status(201).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Match a ride with available drivers
exports.matchRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    const matchedDrivers = await matchingService.findAvailableDrivers(
      ride.pickupLocation
    );
    if (matchedDrivers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No available drivers found" });
    }

    ride.status = "matched";
    ride.driverId = matchedDrivers[0]._id; // Assign the first available driver
    await ride.save();

    notificationService.notifyDriver(matchedDrivers[0]._id, ride);
    res.status(200).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    ride.status = status;
    await ride.save();

    res.status(200).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel a ride
exports.cancelRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    ride.status = "cancelled";
    await ride.save();

    res
      .status(200)
      .json({ success: true, message: "Ride cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
