// models/HolidayModel.js

import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    unique: true, // Format: "DD_MM_YYYY"
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use existing model if it exists to avoid OverwriteModelError
const HolidayModel =
  mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema);

export default HolidayModel;
