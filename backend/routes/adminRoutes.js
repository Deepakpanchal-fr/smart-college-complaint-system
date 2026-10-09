const r = require("express").Router(),
  p = require("../middleware/authMiddleware"),
  role = require("../middleware/roleMiddleware"),
  c = require("../controllers/adminController");
r.use(p, role("admin"));
r.get("/dashboard", c.dashboard);
r.get("/users", c.users);
r.post("/staff", c.createStaff);
r.patch("/users/:id/toggle", c.toggle);
r.get("/departments", c.deps);
r.post("/departments", c.createDep);
r.put("/departments/:id", c.updateDep);
r.delete("/departments/:id", c.deleteDep);
module.exports = r;
