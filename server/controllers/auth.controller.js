import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/database.js";

const UNIQUE_CONSTRAINT_REGEX = {
  email: /for key '.*(email|users_email_unique).*'/i,
  username: /for key '.*(username|users_username_unique).*'/i,
  phone: /for key '.*(phone|users_phone_unique).*'/i,
};

export const register = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const userId = uuidv4();
    const { name, username, email, password, phone } = req.body;

    // Enhanced duplicate check
    const [existing] = await connection.query(
      `SELECT email, username, phone FROM users
       WHERE email = ? OR username = ? OR phone = ?
       LIMIT 1`,
      [email, username, phone || ""]
    );

    if (existing.length) {
      const conflicts = [];
      if (existing[0].email === email) conflicts.push("email");
      if (existing[0].username === username) conflicts.push("username");
      if (existing[0].phone === phone) conflicts.push("phone");

      return res.status(409).json({
        error: "Duplicate entries found",
        conflicts,
        message: `${conflicts.join(", ")} already in use`,
      });
    }

    // Password validation
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      return res.status(400).json({
        error: "Weak password",
        message: "Must contain uppercase, lowercase, and number",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Fixed parameter order and count
    const [result] = await connection.query(
      `INSERT INTO users 
       (id, name, username, email, password, provider, phone)
       VALUES (?, ?, ?, ?, ?, 'native', ?)`,
      [userId, name, username, email, passwordHash, phone || null]
    );

    if (result.affectedRows !== 1) {
      throw new Error("User creation failed - no rows affected");
    }

    // Verify inserted user
    const [users] = await connection.query(
      `SELECT id, username, email, name, phone 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!users.length) {
      throw new Error(`User verification failed for ID: ${userId}`);
    }

    const user = users[0];
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    await connection.commit();

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Registration error:", err);

    // Handling MySQL errors
    if (err.code === "ER_DUP_ENTRY") {
      const field =
        Object.entries(UNIQUE_CONSTRAINT_REGEX).find(([_, regex]) =>
          regex.test(err.message)
        )?.[0] || "unknown";

      return res.status(409).json({
        error: `${field} already exists`,
        field,
        resolution: getResolutionMessage(field),
      });
    }

    // Single error response
    return res.status(err.code === "ER_NO_DEFAULT_FOR_FIELD" ? 400 : 500).json({
      error: "Registration failed",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } finally {
    connection.release();
  }
};

// Helper function remains the same
function getResolutionMessage(field) {
  /* ... */
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      `SELECT * FROM users 
       WHERE email = ? OR username = ? OR phone = ?
       LIMIT 1`,
      [email, email, email]
    );

    if (!users.length) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid credentials",
      });
    }

    const user = users[0];
    const validPass = await bcryptjs.compare(password, user.password);

    if (!validPass) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      tokenType: "Bearer",
      expiresIn: 30 * 24 * 60 * 60,
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Login failed",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};
