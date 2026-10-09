const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select("_id name description")
      .sort({ name: 1 });

    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
});

module.exports = router;