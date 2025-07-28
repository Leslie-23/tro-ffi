const express = require("express");
const router = express.Router();
const operatorController = require("../controllers/operatorController");

// Route to register a new operator
router.post("/register", operatorController.registerOperator);

// Route to get operator details
router.get("/:id", operatorController.getOperatorDetails);

// Route to update operator information
router.put("/:id", operatorController.updateOperator);

// Route to delete an operator
router.delete("/:id", operatorController.deleteOperator);

// Route to get all operators
router.get("/", operatorController.getAllOperators);

// Route to manage fleet (add, update, remove vehicles)
// router.post('/:id/fleet', operatorController.manageFleet);

module.exports = router;
