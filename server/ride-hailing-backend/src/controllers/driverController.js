const Driver = require("../models/driver");
const User = require("../models/user");

// Register a new driver
exports.registerDriver = async (req, res) => {
  try {
    const { userId, licenseNumber, licenseExpiry, experience } = req.body;

    const existingDriver = await Driver.findOne({ where: { user_id: userId } });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver already registered." });
    }

    const driver = await Driver.create({
      user_id: userId,
      license_number: licenseNumber,
      license_expiry: licenseExpiry,
      experience,
    });

    return res.status(201).json(driver);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering driver.", error });
  }
};

// Update driver status
exports.updateDriverStatus = async (req, res) => {
  try {
    const { driverId, status } = req.body;

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    driver.status = status;
    await driver.save();

    return res.status(200).json(driver);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating driver status.", error });
  }
};

// Assign a trip to a driver
exports.assignTrip = async (req, res) => {
  try {
    const { driverId, tripDetails } = req.body;

    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    // Logic to assign trip to driver (e.g., update trip status, notify driver, etc.)
    // This is a placeholder for actual trip assignment logic
    driver.current_trip = tripDetails; // Assuming you have a field for current trip
    await driver.save();

    return res
      .status(200)
      .json({ message: "Trip assigned successfully.", driver });
  } catch (error) {
    return res.status(500).json({ message: "Error assigning trip.", error });
  }
};
exports.getDriverDetails = async (req, res) => {};
exports.getAllDrivers = async (req, res) => {};
