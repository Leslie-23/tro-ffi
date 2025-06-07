import db from "../config/database.js";

const Bus = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM buses");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async (bus) => {
    const [result] = await db.query("INSERT INTO buses SET ?", bus);
    return { id: result.insertId, ...bus };
  },

  update: async (id, bus) => {
    const [result] = await db.query("UPDATE buses SET ? WHERE id = ?", [
      bus,
      id,
    ]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM buses WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
  // New enhanced methods
  getAllWithDetails: async () => {
    const [rows] = await db.query(`
      SELECT b.*, o.name as operator_name, 
             CONCAT(u.name, ' (', d.license_number, ')') as driver_info
      FROM buses b
      LEFT JOIN operators o ON b.operator_id = o.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
    `);
    return rows;
  },

  getByIdWithDetails: async (id) => {
    const [rows] = await db.query(
      `
      SELECT b.*, o.name as operator_name, 
             CONCAT(u.name, ' (', d.license_number, ')') as driver_info
      FROM buses b
      LEFT JOIN operators o ON b.operator_id = o.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE b.id = ?
    `,
      [id]
    );
    return rows[0] || null;
  },

  // Additional helper methods
  getByOperatorId: async (operatorId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE operator_id = ?", [
      operatorId,
    ]);
    return rows;
  },

  getByDriverId: async (driverId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE driver_id = ?", [
      driverId,
    ]);
    return rows;
  },

  updateStatus: async (id, status) => {
    const [result] = await db.query(
      "UPDATE buses SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },

  updateOccupancy: async (id, change) => {
    const [result] = await db.query(
      "UPDATE buses SET current_occupancy = current_occupancy + ? WHERE id = ?",
      [change, id]
    );
    return result.affectedRows > 0;
  },
};

export default Bus;
