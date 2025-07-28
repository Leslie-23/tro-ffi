const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

// Password reset
// router.post('/reset-password', authController.resetPassword);

// Get user profile
// router.get('/profile', authController.getProfile);

// Update user profile
// router.put('/profile', authController.updateProfile);

module.exports = router;
