import db from "../config/database.js";

const Route = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT r.*, 
              sl.name AS start_location_name, sl.latitude AS start_lat, sl.longitude AS start_lng,
              el.name AS end_location_name, el.latitude AS end_lat, el.longitude AS end_lng
       FROM routes r
       JOIN locations sl ON r.start_location_id = sl.id
       JOIN locations el ON r.end_location_id = el.id`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT r.*, 
              sl.name AS start_location_name, sl.latitude AS start_lat, sl.longitude AS start_lng,
              el.name AS end_location_name, el.latitude AS end_lat, el.longitude AS end_lng
       FROM routes r
       JOIN locations sl ON r.start_location_id = sl.id
       JOIN locations el ON r.end_location_id = el.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  create: async (routeData) => {
    const [result] = await db.query("INSERT INTO routes SET ?", routeData);
    return { id: result.insertId, ...routeData };
  },

  update: async (id, data) => {
    const [result] = await db.query("UPDATE routes SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM routes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

export default Route;
