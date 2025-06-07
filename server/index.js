import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import mysql from "mysql2/promise";
import passport from "passport";
import "./config/passport.js"; // Import passport configuration

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import busRoutes from "./routes/bus.routes.js";

const app = express();
app.use(express.json());

// Session configuration
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
// app.use((req, res, next) => {
//   if (
//     req.headers["content-type"] !== "application/json" ||
//     req.headers["content-type"] !== "multipart/form-data"
//   ) {
//     return res.status(415).json({ error: "Unsupported Media Type" });
//   }
//   next();
// });

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
if (
  (pool,
  async (req, res) => {
    res.json({ message: "API is running - database" });
  })
)
  // auth API
  app.use("/api", authRoutes);
app.use("/api/auth", authRoutes);

// booking routes
app.use("/api", bookingRoutes);

// bus routes
app.use("/api/buses", busRoutes);

// Routes API
app.get("/api/routes", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, 
        sl.name AS start_location_name,
        el.name AS end_location_name
      FROM routes r
      JOIN locations sl ON r.start_location_id = sl.id
      JOIN locations el ON r.end_location_id = el.id
      ORDER BY r.popularity DESC
      LIMIT 10
    `);

    res.json({ count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/routes/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, 
        sl.name AS start_location_name,
        el.name AS end_location_name
      FROM routes r
      JOIN locations sl ON r.start_location_id = sl.id
      JOIN locations el ON r.end_location_id = el.id
      ORDER BY r.popularity DESC
      
    `);
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", async (req, res) => {
  // res.send("hello");
  res.json({ message: "API is running - entry point" });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
