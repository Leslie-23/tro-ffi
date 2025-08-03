import Driver from "../models/Driver.js";

export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.getById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const updateDriverProfile = async (req, res) => {
  try {
    const updated = await Driver.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Update failed" });
    res.json({ message: "Driver updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignedBuses = async (req, res) => {
  try {
    const buses = await Driver.getMyBuses(req.params.id);
    res.json({ count: buses.length, buses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Driver.getMyBookings(req.params.id);
    res.json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const updated = await Driver.updateStatus(req.params.id, req.body.status);
    if (!updated)
      return res.status(404).json({ message: "Failed to update status" });
    res.json({ message: "Driver status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyDriver = async (req, res) => {
  try {
    const verified = await Driver.verifyDriver(req.params.id);
    if (!verified)
      return res.status(404).json({ message: "Verification failed" });
    res.json({ message: "Driver verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
