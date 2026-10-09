require("dotenv").config();
const bcrypt = require("bcryptjs"),
  connectDB = require("../config/db"),
  User = require("../models/User");
(async () => {
  try {
    await connectDB();
    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME = "College Admin",
    } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD)
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() })) {
      console.log("Admin already exists.");
      process.exit(0);
    }
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: "admin",
    });
    console.log(`Admin created: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
