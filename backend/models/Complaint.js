const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: {
      type: String,
      enum: [
        "Electrical",
        "Plumbing",
        "Cleanliness",
        "Internet/WiFi",
        "Hostel",
        "Classroom",
        "Library",
        "Transport",
        "Security",
        "Other",
      ],
      required: true,
    },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    attachment: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
    resolutionNote: { type: String, trim: true, maxlength: 2000 },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Complaint", schema);
