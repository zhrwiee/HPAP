import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Appointment = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { department, icon } = location.state || {};
  const [holidays, setHolidays] = useState([]);

  const [form, setForm] = useState({
    date: null,
    time: '',
    referral: null,
    symptoms: [],
    otherSymptom: '',
  });

  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM'
  ];

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const handleDateChange = (date) => {
    if (!date) return;

    const day = date.getDay();
    const formatted = date.toISOString().split('T')[0];

    const isHoliday = holidays.some(h => h.toISOString().split('T')[0] === formatted);

    if (day === 0 || day === 6) {
      toast.error('Appointments are only available Monday to Friday');
      return;
    }

    if (isHoliday) {
      toast.error('This date is a holiday. Please select another date.');
      return;
    }

    setForm(prev => ({ ...prev, date }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, referral: e.target.files[0] }));
  };

  const handleTimeSelect = (slot) => {
    setForm(prev => ({ ...prev, time: slot }));
  };

const fetchHolidays = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/user/get-holidays`);
    if (data.success && Array.isArray(data.holidays)) {
      const holidayDates = data.holidays.map(h => {
        const [d, m, y] = h.date.split('_');
        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
      });
      setHolidays(holidayDates);
    }
  } catch (err) {
    console.error("Error fetching holidays:", err);
  }
};

  const checkSlotAvailability = async () => {
    if (!form.date || !department) return;

    const [year, month, day] = form.date.toISOString().split('T')[0].split('-');
    const slotDate = `${parseInt(day)}_${parseInt(month)}_${year}`;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/check-slot?department=${department}&date=${slotDate}`
      );
      if (data.success) {
        setUnavailableSlots(data.unavailable || []);
      }
    } catch (error) {
      console.error('Slot availability error:', error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  useEffect(() => {
    checkSlotAvailability();
  }, [form.date]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }

    if (!department || !form.date || !form.time || !userData || !userData._id) {
      toast.error('Missing required information');
      return;
    }

    const [year, month, day] = form.date.toISOString().split('T')[0].split('-');
    const slotDate = `${parseInt(day)}_${parseInt(month)}_${year}`;
    const slotTime = form.time;

    const formData = new FormData();
    formData.append('userId', userData._id);
    formData.append('departmentname', department);
    formData.append('slotDate', slotDate);
    formData.append('slotTime', slotTime);
    formData.append('otherSymptom', form.otherSymptom.trim());

    form.symptoms.forEach(s => {
      formData.append('symptoms[]', s);
    });

    if (form.referral) {
      formData.append('referralLetter', form.referral);
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setForm({
          date: null,
          time: '',
          referral: null,
          symptoms: [],
          otherSymptom: '',
        });
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded relative">
      <button
        onClick={() => navigate('/department')}
        className="absolute top-4 left-4 text-sm bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90"
      >
        ← Back to Department
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Book Appointment</h2>

      <div className="text-center text-sm font-medium mb-4">
        <p><span className="text-gray-500">Department:</span> {department || 'Not selected'}</p>
        {icon && <img src={icon} alt="Department Icon" className="mx-auto mt-2 w-12 h-12" />}
      </div>

      {/* Date Picker */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Appointment Date</label>
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          minDate={today}
          maxDate={maxDate}
          placeholderText="Select a date"
          className="w-full border px-3 py-2 rounded"
          filterDate={(date) => {
            const day = date.getDay();
            const isHoliday = holidays.some(h => h.toDateString() === date.toDateString());
            return day !== 0 && day !== 6 && !isHoliday;
          }}

        />
      </div>

      {/* Time Slots */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Select Time</label>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map(slot => {
            const isUnavailable = unavailableSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => !isUnavailable && handleTimeSelect(slot)}
                disabled={isUnavailable}
                className={`px-4 py-2 text-sm rounded border ${
                  form.time === slot
                    ? 'bg-blue-500 text-white'
                    : isUnavailable
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Referral Upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Upload Referral Letter (Optional)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border px-3 py-2 rounded"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {/* Symptoms */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Select Symptoms</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Fever', 'Cough', 'Headache', 'Nausea', 'Body Pain', 'Others'].map(symptom => (
            <label key={symptom} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={symptom}
                checked={form.symptoms.includes(symptom)}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    symptoms: prev.symptoms.includes(value)
                      ? prev.symptoms.filter(s => s !== value)
                      : [...prev.symptoms, value],
                  }));
                }}
              />
              {symptom}
            </label>
          ))}
        </div>
        {form.symptoms.includes('Others') && (
          <input
            type="text"
            name="otherSymptom"
            placeholder="Please specify"
            value={form.otherSymptom}
            onChange={(e) => setForm(prev => ({ ...prev, otherSymptom: e.target.value }))}
            className="w-full mt-2 border px-3 py-2 rounded"
          />
        )}
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="button"
          onClick={bookAppointment}
          className="bg-primary text-white px-8 py-2 rounded-full"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointment;
