import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import {} from "../models/Operator.js";

export const getAllBuses = async (req, res) => {
  try {
    // Include operator and driver information in the response
    const buses = await Bus.getAllWithDetails();
    res.json({ count: buses.length, buses });
  } catch (err) {
    console.error("Error in getAllBuses:", err);
    res.status(500).json({ error: "Failed to retrieve buses" });
  }
};

export const getBusById = async (req, res) => {
  try {
    // Include full details with operator and driver info
    const bus = await Bus.getByIdWithDetails(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (err) {
    console.error("Error in getBusById:", err);
    res.status(500).json({ error: "Failed to retrieve bus details" });
  }
};

export const createBus = async (req, res) => {
  try {
    const { operator_id, ...busData } = req.body;

    // Validate operator exists
    // const operator = await Operator.getById(operator_id);
    // if (!operator) {
    //   return res.status(400).json({ error: "Invalid operator ID" });
    // }

    // Validate driver if provided
    if (busData.driver_id) {
      const driver = await Driver.getById(busData.driver_id);
      if (!driver) {
        return res.status(400).json({ error: "Invalid driver ID" });
      }
    }

    const newBus = await Bus.create(req.body);
    res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (err) {
    console.error("Error in createBus:", err);
    res.status(400).json({
      error:
        err.code === "ER_NO_REFERENCED_ROW_2"
          ? "Invalid operator or driver reference"
          : "Failed to create bus",
      stack: err.stack,
    });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { operator_id, driver_id, ...updateData } = req.body;

    // Validate operator if being updated
    // if (operator_id) {
    //   const operator = await Operator.getById(operator_id);
    //   if (!operator) {
    //     return res.status(400).json({ error: "Invalid operator ID" });
    //   }
    // }

    // Validate driver if being updated
    if (driver_id) {
      const driver = await Driver.getById(driver_id);
      if (!driver) {
        return res.status(400).json({ error: "Invalid driver ID" });
      }
    }

    const updated = await Bus.update(id, {
      ...updateData,
      operator_id,
      driver_id,
    });
    if (!updated) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus updated successfully" });
  } catch (err) {
    console.error("Error in updateBus:", err);
    res.status(400).json({
      error:
        err.code === "ER_NO_REFERENCED_ROW_2"
          ? "Invalid operator or driver reference"
          : "Failed to update bus",
      stack: err.stack,
    });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for active bookings
    // const activeBookings = await Booking.findActiveByBusId(id);
    // if (activeBookings.length > 0) {
    //   return res.status(400).json({
    //     error: "Cannot delete bus with active bookings",
    //     activeBookings,
    //   });
    // }

    const deleted = await Bus.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBus:", err);
    res.status(400).json({ error: "Failed to delete bus", stack: err.stack });
  }
};
