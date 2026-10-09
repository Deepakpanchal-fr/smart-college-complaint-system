const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "Not authorized. Token required." });
    const token = h.split(" ")[1];
    const d = jwt.verify(token, process.env.JWT_SECRET);
    const u = await User.findById(d.userId).select("-password");
    if (!u || !u.isActive)
      return res.status(401).json({ message: "User not found or inactive." });
    req.user = u;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
