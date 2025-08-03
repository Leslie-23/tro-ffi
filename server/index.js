import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import mysql from "mysql2/promise";
import passport from "passport";
import "./config/passport.js"; // Import passport configuration

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import busRoutes from "./routes/bus.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import operatorRoutes from "./routes/operator.routes.js";
import routeRoutes from "./routes/route.routes.js";

const app = express();
app.use(express.json());

import morgan from "morgan";
app.use(morgan("dev"));

import { swaggerSpec, swaggerUi } from "./swagger.js"; // adjust path
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// operator routes
app.use("/api/operator", operatorRoutes);

// driver routes
app.use("/api/driver", driverRoutes);

// route routes
app.use("/api/routes", routeRoutes);

app.get("/", async (req, res) => {
  // res.send("hello");
  res.json({ message: "API is running - entry point" });
});
app.get("/api", async (req, res) => {
  // res.send("hello");
  res.json({ message: "API on v1" });
});
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
