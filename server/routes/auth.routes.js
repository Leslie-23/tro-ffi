import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { login, register } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../middleware/validation.js";

const authRoutes = express.Router();

// Native auth
authRoutes.post("/register", validateRegister, register);
authRoutes.post("/login", validateLogin, login);

// Google Sign-In
authRoutes.get(
  "/google",
  passport.authenticate("google-signin", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "select_account",
  })
);

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

// Google Sign-Up
authRoutes.get(
  "/google/signup",
  passport.authenticate("google-signup", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

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
