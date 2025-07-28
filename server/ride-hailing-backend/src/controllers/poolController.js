const Carpool = require("../models/carpool");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");

// Create a new carpool request
exports.createCarpoolRequest = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      startLocation,
      endLocation,
      seatsAvailable,
      fare,
    } = req.body;

    const carpoolRequest = new Carpool({
      userId,
      vehicleId,
      startLocation,
      endLocation,
      seatsAvailable,
      fare,
      status: "open",
      createdAt: new Date(),
    });

    await carpoolRequest.save();
    res.status(201).json({
      message: "Carpool request created successfully",
      carpoolRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating carpool request", error });
  }
};

exports.updateCarpoolRequest = async (req, res) => {};

// Get all active carpool requests
exports.getActiveCarpoolRequests = async (req, res) => {
  try {
    const carpoolRequests = await Carpool.find({ status: "open" })
      .populate("userId")
      .populate("vehicleId");
    res.status(200).json(carpoolRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving carpool requests", error });
  }
};

// Get all carpool requests
exports.getAllCarpoolRequests = async (req, res) => {
  try {
    const carpoolRequests = await Carpool.find({ status: "open" })
      .populate("userId")
      .populate("vehicleId");
    res.status(200).json(carpoolRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving carpool requests", error });
  }
};

// Join a carpool request
exports.joinCarpoolRequest = async (req, res) => {
  try {
    const { carpoolId, userId } = req.body;

    const carpoolRequest = await Carpool.findById(carpoolId);
    if (!carpoolRequest) {
      return res.status(404).json({ message: "Carpool request not found" });
    }

    if (carpoolRequest.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    carpoolRequest.seatsAvailable -= 1;
    carpoolRequest.passengers.push(userId);
    await carpoolRequest.save();

    res
      .status(200)
      .json({ message: "Successfully joined carpool", carpoolRequest });
  } catch (error) {
    res.status(500).json({ message: "Error joining carpool request", error });
  }
};

// Close a carpool request
exports.closeCarpoolRequest = async (req, res) => {
  try {
    const { carpoolId } = req.params;

    const carpoolRequest = await Carpool.findById(carpoolId);
    if (!carpoolRequest) {
      return res.status(404).json({ message: "Carpool request not found" });
    }

    carpoolRequest.status = "closed";
    await carpoolRequest.save();

    res
      .status(200)
      .json({ message: "Carpool request closed successfully", carpoolRequest });
  } catch (error) {
    res.status(500).json({ message: "Error closing carpool request", error });
  }
};
