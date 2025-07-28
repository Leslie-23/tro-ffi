const Operator = require("../models/operator");
const User = require("../models/user");

// Register a new operator
exports.registerOperator = async (req, res) => {
  try {
    const {
      name,
      password,
      fleet_size,
      commission,
      contact_person,
      contact_phone,
      address,
    } = req.body;

    const newOperator = new Operator({
      id: generateUniqueId(),
      name,
      password, // Consider hashing the password before saving
      fleet_size,
      commission,
      contact_person,
      contact_phone,
      address,
    });

    await newOperator.save();
    res
      .status(201)
      .json({
        message: "Operator registered successfully",
        operator: newOperator,
      });
  } catch (error) {
    res.status(500).json({ message: "Error registering operator", error });
  }
};

// Get all operators
exports.getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find();
    res.status(200).json(operators);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving operators", error });
  }
};
exports.getOperatorDetails = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Error retrieving operators", error });
  }
};

// Update operator details
exports.updateOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedOperator = await Operator.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedOperator) {
      return res.status(404).json({ message: "Operator not found" });
    }

    res
      .status(200)
      .json({
        message: "Operator updated successfully",
        operator: updatedOperator,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating operator", error });
  }
};

// Delete an operator
exports.deleteOperator = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOperator = await Operator.findByIdAndDelete(id);
    if (!deletedOperator) {
      return res.status(404).json({ message: "Operator not found" });
    }

    res.status(200).json({ message: "Operator deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting operator", error });
  }
};

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
