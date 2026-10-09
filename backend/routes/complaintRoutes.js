const r = require("express").Router(),
  p = require("../middleware/authMiddleware"),
  role = require("../middleware/roleMiddleware"),
  upload = require("../middleware/uploadMiddleware"),
  c = require("../controllers/complaintController");
r.post("/", p, role("student"), upload.single("attachment"), c.createComplaint);
r.get("/my", p, role("student"), c.getMyComplaints);
r.get("/staff", p, role("staff"), c.staff);
r.get("/admin/all", p, role("admin"), c.all);
r.get("/:id", p, c.getById);
r.put("/:id/status", p, role("staff", "admin"), c.updateStatus);
r.put("/:id/assign", p, role("admin"), c.assign);
r.delete("/:id", p, c.del);
module.exports = r;
