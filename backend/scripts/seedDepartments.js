require("dotenv").config();
const mongoose = require("mongoose");
const Department = require("../models/Department");

const departments = [
  {
    name: "Computer Science & Engineering",
    description: "Computer Science and Engineering Department",
  },
  {
    name: "Information Technology",
    description: "Information Technology Department",
  },
  {
    name: "Electronics & Communication",
    description: "Electronics and Communication Engineering Department",
  },
  {
    name: "Electrical Engineering",
    description: "Electrical Engineering Department",
  },
  {
    name: "Mechanical Engineering",
    description: "Mechanical Engineering Department",
  },
  {
    name: "Civil Engineering",
    description: "Civil Engineering Department",
  },
  {
    name: "Administration",
    description: "College Administration Department",
  },
  {
    name: "Examination Cell",
    description: "Examination and Academic Records",
  },
  {
    name: "Library",
    description: "Central Library Department",
  },
  {
    name: "Hostel & Accommodation",
    description: "Hostel and Accommodation Services",
  },
  {
    name: "Accounts & Finance",
    description: "Fees and Finance Department",
  },
  {
    name: "Training & Placement",
    description: "Training and Placement Department",
  },
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const department of departments) {
      await Department.updateOne(
        { name: department.name },
        { $set: department },
        { upsert: true }
      );
    }

    console.log("✅ Departments seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDepartments();