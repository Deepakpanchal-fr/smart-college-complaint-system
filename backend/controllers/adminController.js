const bcrypt = require("bcryptjs"),
  User = require("../models/User"),
  Department = require("../models/Department"),
  Complaint = require("../models/Complaint"),
  asyncHandler = require("../utils/asyncHandler");
const dashboard = asyncHandler(async (_q, res) => {
  const [total, pending, assigned, inProgress, resolved, rejected] =
    await Promise.all(
      ["", "Pending", "Assigned", "In Progress", "Resolved", "Rejected"].map(
        (s) => Complaint.countDocuments(s ? { status: s } : {}),
      ),
    );
  const categoryStats = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({
    totals: { total, pending, assigned, inProgress, resolved, rejected },
    categoryStats,
  });
});
const users = asyncHandler(async (req, res) => {
  const f = req.query.role ? { role: req.query.role } : {};
  const u = await User.find(f)
    .select("-password")
    .populate("department", "name")
    .sort({ createdAt: -1 });
  res.json({ count: u.length, users: u });
});
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  if (await User.findOne({ email: email.toLowerCase().trim() }))
    return res.status(409).json({ message: "User already exists." });
  const u = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 12),
    role: "staff",
    department: department || null,
  });
  res
    .status(201)
    .json({
      message: "Staff created successfully.",
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
      },
    });
});
const toggle = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: "User not found." });
  if (u._id.toString() === req.user._id.toString())
    return res
      .status(400)
      .json({ message: "You cannot deactivate your own account." });
  u.isActive = !u.isActive;
  await u.save();
  res.json({
    message: `User ${u.isActive ? "activated" : "deactivated"}.`,
    user: { id: u._id, isActive: u.isActive },
  });
});
const deps = asyncHandler(async (_q, res) =>
  res.json({ departments: await Department.find().sort({ name: 1 }) }),
);
const createDep = asyncHandler(async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ message: "Department name is required." });
  res
    .status(201)
    .json({
      message: "Department created.",
      department: await Department.create(req.body),
    });
});
const updateDep = asyncHandler(async (req, res) => {
  const d = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!d) return res.status(404).json({ message: "Department not found." });
  res.json({ message: "Department updated.", department: d });
});
const deleteDep = asyncHandler(async (req, res) => {
  const d = await Department.findByIdAndDelete(req.params.id);
  if (!d) return res.status(404).json({ message: "Department not found." });
  res.json({ message: "Department deleted." });
});
module.exports = {
  dashboard,
  users,
  createStaff,
  toggle,
  deps,
  createDep,
  updateDep,
  deleteDep,
};
