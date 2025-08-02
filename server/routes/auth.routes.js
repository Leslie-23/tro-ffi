import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import { login, register } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../middleware/validation.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 */

// Native auth
authRoutes.post("/register", validateRegister, register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

authRoutes.post("/login", validateLogin, login);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Google Sign-In
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google Sign-In
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */

// Google Sign-In
authRoutes.get(
  "/google",
  passport.authenticate("google-signin", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "select_account",
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google Sign-In callback handler
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect with JWT to frontend
 *       401:
 *         description: Google authentication failed
 */
authRoutes.get(
  "/google/callback",
  passport.authenticate("google-signin", {
    failureRedirect: "/login?error=google",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

/**
 * @swagger
 * /auth/google/signup:
 *   get:
 *     summary: Initiate Google Sign-Up flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for sign-up
 */

// Google Sign-Up
authRoutes.get(
  "/google/signup",
  passport.authenticate("google-signup", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

/**
 * @swagger
 * /auth/google/signup/callback:
 *   get:
 *     summary: Google Sign-Up callback handler
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to welcome page with JWT
 *       401:
 *         description: Google signup failed
 */
authRoutes.get(
  "/google/signup/callback",
  passport.authenticate("google-signup", {
    failureRedirect: "/signup?error=google",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/welcome?token=${token}`);
  }
);

export default authRoutes;

// import express from "express";
// import passport from "passport";
// import { login, register } from "../controllers/auth.controller.js";
// import { validateLogin, validateRegister } from "../middleware/validation.js";

// const authRoutes = express.Router();

// // Native auth
// authRoutes.post("/register", validateRegister, register);
// authRoutes.post("/login", validateLogin, login);

// // Google auth
// authRoutes.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// authRoutes.get(
//   "/google/callback",
//   passport.authenticate("google", { session: true }),
//   (req, res) => {
//     // Generate JWT for Google user
//     const token = jwt.sign(
//       { userId: req.user.id, username: req.user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     res.redirect(`/auth/success?token=${token}&username=${req.user.username}`);
//   }
// );
// // Google Sign-Up Initiation
// authRoutes.get(
//   "/google/signup",
//   passport.authenticate("google-signup", {
//     scope: ["email", "profile"],
//     prompt: "consent", // Forces re-approval for sign-up
//     session: true,
//   })
// );

// // Google Sign-Up Callback
// authRoutes.get(
//   "/google/signup/callback",
//   passport.authenticate("google-signup", {
//     failureRedirect: "/signup", // Where to redirect if signup fails
//     failureMessage: true,
//     session: true,
//     scope: ["email", "profile"],
//     prompt: "consent", // Forces re-approval for sign-up
//   }),
//   (req, res) => {
//     // Successful signup
//     res.redirect("/welcome"); // Redirect to welcome/new user page
//   }
// );

// export default authRoutes;
