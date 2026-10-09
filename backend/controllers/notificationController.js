const Notification = require("../models/Notification"),
  asyncHandler = require("../utils/asyncHandler");
const list = asyncHandler(async (req, res) => {
  const n = await Notification.find({ user: req.user._id })
    .populate("complaint", "title status")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ unread: n.filter((x) => !x.isRead).length, notifications: n });
});
const read = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true },
  );
  if (!n) return res.status(404).json({ message: "Notification not found." });
  res.json({ message: "Notification marked as read.", notification: n });
});
const readAll = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true },
  );
  res.json({ message: "All notifications marked as read." });
});
module.exports = { list, read, readAll };
