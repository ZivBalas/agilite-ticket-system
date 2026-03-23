import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import seedProducts from "../services/seedProducts.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await seedProducts();
  await mongoose.disconnect();
  console.log("DB connection closed.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
