const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Get user profile
router.get('/:userId', userController.getUserProfile);

// Update user profile
router.put('/:userId', userController.updateUserProfile);

// Get user's ride history
router.get('/:userId/ride-history', userController.getUserRideHistory);

// Get user's pool requests
router.get('/:userId/pool-requests', userController.getUserPoolRequests);

// Create a new pool request
router.post('/:userId/pool-requests', userController.createPoolRequest);

// Update a pool request
router.put('/:userId/pool-requests/:requestId', userController.updatePoolRequest);

// Delete a pool request
router.delete('/:userId/pool-requests/:requestId', userController.deletePoolRequest);

module.exports = router;