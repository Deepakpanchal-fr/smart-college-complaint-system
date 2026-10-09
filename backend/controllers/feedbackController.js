const Feedback = require("../models/Feedback"),
  Complaint = require("../models/Complaint"),
  asyncHandler = require("../utils/asyncHandler"),
  notify = require("../utils/createNotification");
const create = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body,
    c = await Complaint.findOne({
      _id: req.params.complaintId,
      student: req.user._id,
    });
  if (!c) return res.status(404).json({ message: "Complaint not found." });
  if (c.status !== "Resolved")
    return res
      .status(400)
      .json({ message: "Feedback can be submitted only after resolution." });
  if (await Feedback.findOne({ complaint: c._id }))
    return res.status(409).json({ message: "Feedback already submitted." });
  const f = await Feedback.create({
    complaint: c._id,
    student: req.user._id,
    rating,
    comment,
  });
  if (c.assignedTo)
    await notify({
      user: c.assignedTo,
      title: "New complaint feedback",
      message: `A student submitted ${rating}/5 feedback for "${c.title}".`,
      type: "feedback",
      complaint: c._id,
    });
  res.status(201).json({ message: "Feedback submitted.", feedback: f });
});
const get = asyncHandler(async (req, res) => {
  const f = await Feedback.findOne({
    complaint: req.params.complaintId,
  }).populate("student", "name email");
  if (!f) return res.status(404).json({ message: "Feedback not found." });
  res.json({ feedback: f });
});
module.exports = { create, get };
