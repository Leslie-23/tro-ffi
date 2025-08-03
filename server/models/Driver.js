import db from "../config/database.js";

const Driver = {
  // Basic CRUD Operations
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM drivers");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM drivers WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async (driverData) => {
    const [result] = await db.query("INSERT INTO drivers SET ?", driverData);
    return { id: result.insertId, ...driverData };
  },

  update: async (id, driverData) => {
    const [result] = await db.query("UPDATE drivers SET ? WHERE id = ?", [
      driverData,
      id,
    ]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM drivers WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Enhanced Methods with Relationships
  getByIdWithUserDetails: async (id) => {
    const [rows] = await db.query(
      `
      SELECT d.*, u.name, u.email, u.phone, u.profile_image
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `,
      [id]
    );
    return rows[0] || null;
  },

  getAllWithUserDetails: async () => {
    const [rows] = await db.query(`
      SELECT d.*, u.name, u.email, u.phone, u.profile_image
      FROM drivers d
      JOIN users u ON d.user_id = u.id
    `);
    return rows;
  },

  getByUserId: async (userId) => {
    const [rows] = await db.query("SELECT * FROM drivers WHERE user_id = ?", [
      userId,
    ]);
    return rows[0] || null;
  },

  // Status Management
  updateStatus: async (id, status) => {
    const [result] = await db.query(
      "UPDATE drivers SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },

  updateVerificationStatus: async (id, status) => {
    const [result] = await db.query(
      "UPDATE drivers SET verification_status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },

  // Statistics and Analytics
  getDriverStats: async (id) => {
    const [rows] = await db.query(
      `
      SELECT 
        COUNT(b.id) as total_trips,
        AVG(b.rating) as average_rating,
        SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_trips
      FROM bookings b
      WHERE b.driver_id = ?
    `,
      [id]
    );
    return rows[0] || null;
  },

  // License Management
  updateLicense: async (id, licenseNumber, expiryDate) => {
    const [result] = await db.query(
      "UPDATE drivers SET license_number = ?, license_expiry = ? WHERE id = ?",
      [licenseNumber, expiryDate, id]
    );
    return result.affectedRows > 0;
  },

  // Validation Methods
  validateLicenseNumber: async (licenseNumber, excludeId = null) => {
    let query = "SELECT id FROM drivers WHERE license_number = ?";
    const params = [licenseNumber];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length === 0; // Returns true if license number is unique
  },

  // Bus Assignment
  getAssignedBus: async (driverId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE driver_id = ?", [
      driverId,
    ]);
    return rows[0] || null;
  },

  assignToBus: async (driverId, busId) => {
    const [result] = await db.query(
      "UPDATE buses SET driver_id = ? WHERE id = ?",
      [driverId, busId]
    );
    return result.affectedRows > 0;
  },

  unassignFromBus: async (busId) => {
    const [result] = await db.query(
      "UPDATE buses SET driver_id = NULL WHERE id = ?",
      [busId]
    );
    return result.affectedRows > 0;
  },
  // };

  // const Driver = {
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM drivers WHERE id = ?", [id]);
    return rows[0] || null;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM drivers");
    return rows;
  },

  update: async (id, data) => {
    const [result] = await db.query("UPDATE drivers SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result.affectedRows > 0;
  },

  getMyBuses: async (driverId) => {
    const [rows] = await db.query("SELECT * FROM buses WHERE driver_id = ?", [
      driverId,
    ]);
    return rows;
  },

  getMyBookings: async (driverId) => {
    const [rows] = await db.query(
      `SELECT b.*, u.name as passenger_name, r.name as route_name
       FROM bookings b
       JOIN buses bu ON b.bus_id = bu.id
       JOIN users u ON b.user_id = u.id
       JOIN routes r ON b.route_id = r.id
       WHERE bu.driver_id = ?`,
      [driverId]
    );
    return rows;
  },

  updateStatus: async (id, status) => {
    const [result] = await db.query(
      "UPDATE drivers SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },

  verifyDriver: async (id) => {
    const [result] = await db.query(
      "UPDATE drivers SET verification_status = 'verified' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

// export default Driver;
export default Driver;
