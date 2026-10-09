const mongoose = require("mongoose");
const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
  try {
    const c = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${c.connection.host}`);
  } catch (e) {
    console.error(`MongoDB connection failed: ${e.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
