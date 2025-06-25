import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const DoctorHealthRecord = () => {
  const { dToken, completeAppointment } = useContext(DoctorContext); // ✅ include completeAppointment
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, appointmentId } = location.state || {}; // ✅ Make sure appointmentId is passed

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    bloodPressure: '',
    heartRate: '',
    diagnosis: '',
    notes: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Step 1: Save health record
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/add-health-record`,
        { ...form, userId },
        { headers: { dToken } }
      );

      if (!data.success) {
        toast.error(data.message || 'Failed to save health record');
        return;
      }

      // Step 2: Mark appointment as completed
      if (appointmentId) {
        await completeAppointment(appointmentId);
      }

      toast.success('Health record saved and appointment marked as completed');
      navigate('/doctor-dashboard');

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while saving record');
    }
  };

  return (
<div className="w-full flex justify-center mt-10">
  <div className="w-full max-w-2xl p-6 bg-white rounded shadow">
    <h2 className="text-2xl font-semibold mb-6 text-center">Add Health Record</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input name="weight" type="number" value={form.weight} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Height (cm)</label>
          <input name="height" type="number" value={form.height} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Blood Pressure</label>
          <input name="bloodPressure" type="text" placeholder="e.g. 120/80" value={form.bloodPressure} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Heart Rate (bpm)</label>
          <input name="heartRate" type="number" value={form.heartRate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Diagnosis</label>
          <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Additional Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full">
          Submit
        </button>
      </form>
    </div>
        </div>
  );
};

export default DoctorHealthRecord;
