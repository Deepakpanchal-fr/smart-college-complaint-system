const r = require("express").Router(),
  p = require("../middleware/authMiddleware"),
  role = require("../middleware/roleMiddleware"),
  c = require("../controllers/feedbackController");
r.post("/:complaintId", p, role("student"), c.create);
r.get("/:complaintId", p, c.get);
module.exports = r;
