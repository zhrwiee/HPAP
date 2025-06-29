import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
 departmentname: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  slots_booked: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { "16_6_2025": ["08:00 AM", "08:30 AM"] }
  createdAt: { type: Date, default: Date.now },
});


const departmentModel = mongoose.models.department || mongoose.model("department", departmentSchema);
export default departmentModel;
