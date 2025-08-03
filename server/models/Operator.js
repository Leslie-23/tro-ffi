// Example of using the enhanced operator model in a controller

export const getOperatorDetails = async (req, res) => {
  try {
    const operator = await Operator.getByIdWithDetails(req.params.id);
    if (!operator) {
      return res.status(404).json({ message: "Operator not found" });
    }

    res.json({
      message: "Operator details retrieved successfully",
      operator,
    });
  } catch (err) {
    console.error("Error getting operator details:", err);
    res.status(500).json({ error: "Failed to retrieve operator details" });
  }
};

import db from "../config/database.js";

const Operator = {
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM operators WHERE id = ?", [id]);
    return rows[0] || null;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM operators");
    return rows;
  },

  update: async (id, updateData) => {
    const [result] = await db.query("UPDATE operators SET ? WHERE id = ?", [
      updateData,
      id,
    ]);
    return result.affectedRows > 0;
  },

  getFleet: async (operatorId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE operator_id = ?", [
      operatorId,
    ]);
    return rows;
  },

  updateBus: async (busId, operatorId, updateData) => {
    const [result] = await db.query(
      "UPDATE buses SET ? WHERE id = ? AND operator_id = ?",
      [updateData, busId, operatorId]
    );
    return result.affectedRows > 0;
  },

  getBookingsForOperator: async (operatorId) => {
    const [rows] = await db.query(
      `SELECT b.*, u.name AS user_name, r.name AS route_name
       FROM bookings b
       JOIN buses bu ON b.bus_id = bu.id
       JOIN users u ON b.user_id = u.id
       JOIN routes r ON b.route_id = r.id
       WHERE bu.operator_id = ?`,
      [operatorId]
    );
    return rows;
  },

  freeUpSeats: async (busId, amount) => {
    const [result] = await db.query(
      `UPDATE buses SET current_occupancy = GREATEST(current_occupancy - ?, 0)
       WHERE id = ?`,
      [amount, busId]
    );
    return result.affectedRows > 0;
  },

  getBusById: async (busId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE id = ?", [busId]);
    return rows[0] || null;
  },
};

export default Operator;
