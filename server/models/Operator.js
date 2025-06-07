// Example of using the enhanced operator model in a controller

export const getOperatorDetails = async (req, res) => {
  try {
    const operator = await Operator.getByIdWithDetails(req.params.id);
    if (!operator) {
      return res.status(404).json({ message: "Operator not found" });
    }

    res.json({
      message: "Operator details retrieved successfully",
      operator,
    });
  } catch (err) {
    console.error("Error getting operator details:", err);
    res.status(500).json({ error: "Failed to retrieve operator details" });
  }
};
