// components/AppointmentCalendar.jsx

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppointmentCalendar = ({ value, onChange, backendUrl }) => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/get-holidays`);
        if (data.success && Array.isArray(data.holidays)) {
          const converted = data.holidays.map(h => {
            const [d, m, y] = h.date.split('_');
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          });
          setHolidays(converted);
        }
      } catch (err) {
        console.error("Failed to load holidays", err);
      }
    };
    fetchHolidays();
  }, [backendUrl]);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const isDisabled = (date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const formatted = date.toISOString().split('T')[0];
    return day === 0 || day === 6 || holidays.includes(formatted);
  };

  const handleChange = (date) => {
    const formatted = date.toISOString().split('T')[0];
    if (isDisabled(date)) {
      toast.error('This date is not available for booking.');
      return;
    }
    onChange(date);
  };

  return (
    <DatePicker
      selected={value}
      onChange={handleChange}
      minDate={today}
      maxDate={maxDate}
      placeholderText="Select appointment date"
      className="w-full border px-3 py-2 rounded"
      filterDate={(date) => !isDisabled(date)}
    />
  );
};

export default AppointmentCalendar;
