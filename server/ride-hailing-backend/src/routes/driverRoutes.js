const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// Route to register a new driver
router.post('/register', driverController.registerDriver);

// Route to update driver status
router.put('/status/:id', driverController.updateDriverStatus);

// Route to assign a trip to a driver
router.post('/assign-trip/:id', driverController.assignTrip);

// Route to get driver details
router.get('/:id', driverController.getDriverDetails);

// Route to get all drivers
router.get('/', driverController.getAllDrivers);

module.exports = router;