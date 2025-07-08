import React, { useContext, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';

const AppointmentCalendar = ({ value, onChange }) => {
  const { holidays = [] } = useContext(AppContext);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  useEffect(() => {
    console.log("Loaded holidays from AppContext:", holidays);
  }, [holidays]);

  const formatDate = (date) => date.toISOString().split('T')[0]; // Safer for comparison

  const isDisabled = (date) => {
    const day = date.getDay();
    const formatted = formatDate(date);
    const result = day === 0 || day === 6 || holidays.includes(formatted);
    console.log(`Checking date: ${formatted} | Weekend: ${day === 0 || day === 6} | Is holiday: ${holidays.includes(formatted)} | Disabled: ${result}`);
    return result;
  };

  const handleChange = (date) => {
    const formatted = formatDate(date);
    if (isDisabled(date)) {
      toast.error(`This date (${formatted}) is not available for booking.`);
      return;
    }
    console.log("Selected valid date:", formatted);
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
      dateFormat="d MMMM yyyy"
    />
  );
};

export default AppointmentCalendar;
