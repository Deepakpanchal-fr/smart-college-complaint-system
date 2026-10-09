const Complaint = require("../models/Complaint"),
  User = require("../models/User"),
  asyncHandler = require("../utils/asyncHandler"),
  notify = require("../utils/createNotification");
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, location, priority, department } =
    req.body;
  if (!title || !description || !category || !location)
    return res
      .status(400)
      .json({
        message: "Title, description, category and location are required.",
      });
  const c = await Complaint.create({
    title,
    description,
    category,
    location,
    priority: priority || "Medium",
    department: department || null,
    student: req.user._id,
    attachment: req.file
      ? {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : undefined,
  });
  await notify({
    user: req.user._id,
    title: "Complaint submitted",
    message: `Your complaint "${c.title}" has been submitted successfully.`,
    type: "complaint",
    complaint: c._id,
  });
  res.status(201).json({
    message: "Complaint created successfully.",
    complaint: await c.populate([
      { path: "student", select: "name email role" },
      { path: "department", select: "name" },
    ]),
  });
});
const getMyComplaints = asyncHandler(async (req, res) => {
  const a = await Complaint.find({ student: req.user._id })
    .populate("assignedTo", "name email")
    .populate("department", "name")
    .sort({ createdAt: -1 });
  res.json({ count: a.length, complaints: a });
});
const getById = asyncHandler(async (req, res) => {
  const c = await Complaint.findById(req.params.id)
    .populate("student", "name email")
    .populate("assignedTo", "name email")
    .populate("department", "name");
  if (!c) return res.status(404).json({ message: "Complaint not found." });
  const owner = c.student._id.toString() === req.user._id.toString(),
    assigned =
      c.assignedTo && c.assignedTo._id.toString() === req.user._id.toString();
  if (!owner && !assigned && req.user.role !== "admin")
    return res.status(403).json({ message: "You cannot view this complaint." });
  res.json({ complaint: c });
});
const all = asyncHandler(async (req, res) => {
  const {
      status,
      category,
      priority,
      search,
      page = 1,
      limit = 10,
    } = req.query,
    f = {};
  if (status) f.status = status;
  if (category) f.category = category;
  if (priority) f.priority = priority;
  if (search)
    f.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  const skip = (Number(page) - 1) * Number(limit),
    [a, total] = await Promise.all([
      Complaint.find(f)
        .populate("student", "name email")
        .populate("assignedTo", "name email")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Complaint.countDocuments(f),
    ]);
  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    complaints: a,
  });
});
const staff = asyncHandler(async (req, res) =>
  res.json({
    complaints: await Complaint.find({ assignedTo: req.user._id })
      .populate("student", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 }),
  }),
);
const assign = asyncHandler(async (req, res) => {
  const { staffId } = req.body,
    c = await Complaint.findById(req.params.id),
    s = await User.findOne({ _id: staffId, role: "staff", isActive: true });
  if (!c) return res.status(404).json({ message: "Complaint not found." });
  if (!s)
    return res.status(404).json({ message: "Active staff member not found." });
  c.assignedTo = s._id;
  c.status = "Assigned";
  await c.save();
  await notify({
    user: s._id,
    title: "New complaint assigned",
    message: `Complaint "${c.title}" has been assigned to you.`,
    type: "assignment",
    complaint: c._id,
  });
  await notify({
    user: c.student,
    title: "Complaint assigned",
    message: `Your complaint "${c.title}" has been assigned.`,
    type: "assignment",
    complaint: c._id,
  });
  res.json({ message: "Complaint assigned successfully.", complaint: c });
});
const updateStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNote } = req.body,
    valid = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
    c = await Complaint.findById(req.params.id);
  if (!valid.includes(status))
    return res.status(400).json({ message: "Invalid complaint status." });
  if (!c) return res.status(404).json({ message: "Complaint not found." });
  const ok =
    req.user.role === "admin" ||
    (req.user.role === "staff" &&
      c.assignedTo &&
      c.assignedTo.toString() === req.user._id.toString());
  if (!ok)
    return res
      .status(403)
      .json({ message: "You cannot update this complaint." });
  c.status = status;
  if (resolutionNote !== undefined) c.resolutionNote = resolutionNote;
  if (status === "Resolved") c.resolvedAt = new Date();
  await c.save();
  await notify({
    user: c.student,
    title: "Complaint status updated",
    message: `Your complaint "${c.title}" is now ${status}.`,
    type: "status",
    complaint: c._id,
  });
  res.json({ message: "Complaint status updated.", complaint: c });
});
const del = asyncHandler(async (req, res) => {
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Complaint not found." });
  if (
    req.user.role !== "admin" &&
    c.student.toString() !== req.user._id.toString()
  )
    return res
      .status(403)
      .json({ message: "You cannot delete this complaint." });
  if (req.user.role !== "admin" && c.status !== "Pending")
    return res
      .status(400)
      .json({ message: "Students can delete complaints only while Pending." });
  await c.deleteOne();
  res.json({ message: "Complaint deleted successfully." });
});
module.exports = {
  createComplaint,
  getMyComplaints,
  getById,
  all,
  staff,
  assign,
  updateStatus,
  del,
};
