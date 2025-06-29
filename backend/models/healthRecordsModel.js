import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date: { type: Date, required: true },
  weight: { type: Number },          // in kg
  height: { type: Number },          // in cm
  bloodPressure: { type: String },   // e.g. "120/80"
  heartRate: { type: Number },       // in bpm
  diagnosis: { type: String },
  notes: { type: String },
}, { timestamps: true });

const HealthRecord = mongoose.models.HealthRecord || mongoose.model("HealthRecord", healthRecordSchema);
export default HealthRecord;