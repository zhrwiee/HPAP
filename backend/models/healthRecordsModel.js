import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: false }, // optional
  date: { type: Date, required: true },
  weight: { type: Number },
  height: { type: Number },
  bloodPressure: { type: String },
  heartRate: { type: Number },
  diagnosis: { type: String },
  notes: { type: String },
}, { timestamps: true });

const HealthRecord = mongoose.models.HealthRecord || mongoose.model("HealthRecord", healthRecordSchema);
export default HealthRecord;