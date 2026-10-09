const r = require("express").Router(),
  p = require("../middleware/authMiddleware"),
  c = require("../controllers/notificationController");
r.use(p);
r.get("/", c.list);
r.patch("/:id/read", c.read);
r.patch("/read-all", c.readAll);
module.exports = r;
