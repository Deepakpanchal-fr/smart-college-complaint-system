const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  User = require("../models/User"),
  asyncHandler = require("../utils/asyncHandler");
  const tokenBlacklistMOdel = require ('../models/tokenblacklist.model')
const pub = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department,
});
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  const e = email.toLowerCase().trim();
  if (await User.findOne({ email: e }))
    return res.status(409).json({ message: "User already exists." });
  const u = await User.create({
    name: name.trim(),
    email: e,
    password: await bcrypt.hash(password, 12),
    role: "student",
  });
  const token = jwt.sign(
    { userId: u._id, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res
    .status(201)
    .json({ message: "Student registered successfully.", user: pub(u) });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const u = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );
  if (!u || !u.isActive || !(await bcrypt.compare(password, u.password)))
    return res.status(401).json({ message: "Invalid email or password." });
  const token = jwt.sign(
    { userId: u._id, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
    res.cookie("token",token,{
    httpOnly : true,
    secure : false ,
    sameSite : "lax"
  })
  res.json({ message: "Login successful.", token, user: pub(u) });
 
});
const logoutUser = asyncHandler(async(req,res)=>{
      const token = req.body 
      await tokenBlacklistMOdel.create({token})
      res.clearCookie("token")
      res.json({message : "Logout successful"})
})
const getMe = asyncHandler(async (req, res) =>
  res.json({ user: pub(await User.findById(req.user._id)) }),
);
module.exports = { registerUser, loginUser, getMe,logoutUser };
