import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  departmentname: { type: String, required: true },
  // Add this field
  read: { type: Boolean, default: false },
  docId: { type: String, required: false },        // optional until assigned
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: false },       // optional until assigned
  date: { type: Number, required: true },
  referralLetter: { type: String, default: null }, // optional
  symptoms: { type: [String], default: [] },
  otherSymptom: { type: String, default: null },
  cancelled: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
});

const appointmentModel =
  mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;