import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

await mongoose.connect(process.env.MONGO_URI);

const email = "admin@driverhub.in";
if (await User.findOne({ email })) {
    console.log("Admin already exists");
} else {
    await User.create({ role: "admin", name: "Super Admin", email, password: "Admin@123" });
    console.log("Admin created:", email);
}

await mongoose.disconnect();