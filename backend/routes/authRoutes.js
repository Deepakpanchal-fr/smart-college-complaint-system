const r = require("express").Router(),
  { registerUser, loginUser, getMe,logoutUser } = require("../controllers/authController"),
  protect = require("../middleware/authMiddleware");
r.post("/register", registerUser);
r.post("/login", loginUser);
r.post("/logout",logoutUser);
r.get("/me", protect, getMe);
module.exports = r;

