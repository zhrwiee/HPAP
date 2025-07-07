import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true, unique: true }, // e.g., "07_07_2025"
  isPublic: { type: Boolean, default: false },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const HolidayModel = mongoose.models.holiday || mongoose.model("holiday", holidaySchema);
export default HolidayModel;
