require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  morgan = require("morgan"),
  rateLimit = require("express-rate-limit"),
  path = require("path"),
  connectDB = require("./config/db");
  const departmentRoutes = require("./routes/departmentRoutes");
const app = express();
connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-college-complaint-system-pi.vercel.app",
  "https://smart-college-complaint-system-qfaqsj1xd-stackforce.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  }),
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (_q, res) =>
  res.json({
    message: "Smart College Complaint Management System API 🚀",
    status: "running",
  }),
);
app.get("/api/health", (_q, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/departments", departmentRoutes);
app.use((_q, res) => res.status(404).json({ message: "Route not found." }));
app.use((err, _q, res, _n) => {
  console.error(err);
  if (err.name === "MulterError" || err.message?.includes("Only JPG"))
    return res.status(400).json({ message: err.message });
  if (err.code === 11000)
    return res.status(409).json({ message: "Duplicate value already exists." });
  res
    .status(500)
    .json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error."
          : err.message,
    });
});
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`),
);
