import React, { useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';

const AppointmentCalendar = ({ value, onChange }) => {
  const { holidays = [] } = useContext(AppContext); // Assumes YYYY-MM-DD format

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Disable weekends and holidays
  const isDisabled = (date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const formatted = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    return day === 0 || day === 6 || holidays.includes(formatted);
  };

  // On user select
  const handleChange = (date) => {
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
      dateFormat="d MMMM yyyy" // Displays like "7 July 2025"
    />
  );
};

export default AppointmentCalendar;
