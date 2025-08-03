import Operator from "../models/Operator.js";

export const getOperatorProfile = async (req, res) => {
  try {
    const operator = await Operator.getById(req.params.id);
    if (!operator)
      return res.status(404).json({ message: "Operator not found" });
    res.json(operator);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const updateOperator = async (req, res) => {
  try {
    const updated = await Operator.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Update failed" });
    res.json({ message: "Operator updated" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const getOperatorFleet = async (req, res) => {
  try {
    const fleet = await Operator.getFleet(req.params.id);
    res.json({ count: fleet.length, fleet });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const updateOperatorBus = async (req, res) => {
  try {
    const updated = await Operator.updateBus(
      req.params.busId,
      req.params.operatorId,
      req.body
    );
    if (!updated)
      return res.status(404).json({ message: "Bus not found or unauthorized" });
    res.json({ message: "Bus updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const freeUpSeats = async (req, res) => {
  // Calculate availableSeats and currentOccupancy before freeing up seats
  // (Assuming Operator.getBusById returns the bus object with seat info)
  const { busId } = req.params;
  const bus = await Operator.getBusById(busId);
  if (!bus) {
    return res.status(404).json({ message: "Bus not found" });
  }
  const totalSeats = bus.capacity || 0;
  const currentOccupancy = bus.currentOccupancy || 0;
  const availableSeats = totalSeats - currentOccupancy;

  try {
    const { busId } = req.params;
    const { seats } = req.body;
    const freed = await Operator.freeUpSeats(busId, seats);
    if (!freed)
      return res.status(400).json({ message: "Failed to free seats" });
    res.json({
      message: `${seats} seats freed up.`,
      statOfFunc: `${freed}`,
      bus: ` Available seats ${availableSeats} && Current Occupancy ${currentOccupancy}`,
      availableSeats: availableSeats,
      currentOccupancy: currentOccupancy,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

export const getOperatorBookings = async (req, res) => {
  try {
    const bookings = await Operator.getBookingsForOperator(req.params.id);
    res.json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
