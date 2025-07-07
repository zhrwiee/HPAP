import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: {type: String,required: true,unique: true,match: [/^\d{1,2}_\d{1,2}_\d{4}$/, 'Date must be in D_M_YYYY format'], // optional
  },
  isPublic: { type: Boolean, default: false },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const HolidayModel = mongoose.models.holiday || mongoose.model("holiday", holidaySchema);
export default HolidayModel;
