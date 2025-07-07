import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

const HolidayCalendar = () => {
  const { getHolidays, addHoliday, deleteHoliday } = useContext(AdminContext);
  const [holidays, setHolidays] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  const handleAdd = async () => {
    if (!title || !date) return alert('Title and date are required');
    const formattedDate = new Date(date).toLocaleDateString('en-GB').split('/').reverse().join('_'); // "YYYY_MM_DD"
    const success = await addHoliday({ title, date: formattedDate, isPublic });
    if (success) {
      setTitle('');
      setDate('');
      setIsPublic(false);
      fetchHolidays();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure to delete this holiday?");
    if (confirmed) {
      const success = await deleteHoliday(id);
      if (success) fetchHolidays();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Holiday Calendar</h2>

      <div className="flex gap-2 flex-wrap mb-4">
        <input
          type="text"
          placeholder="Holiday title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          Public
        </label>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Holiday
        </button>
      </div>

      <div className="border rounded p-2 bg-white">
        {holidays.length === 0 && <p>No holidays added.</p>}
        {holidays.map((h, i) => (
          <div key={i} className="flex justify-between border-b py-2 px-2 items-center">
            <div>
              <p className="font-medium">{h.title}</p>
              <p className="text-sm text-gray-500">
                {h.date.replaceAll('_', '/')} {h.isPublic ? "(Public)" : ""}
              </p>
            </div>
            <button
              onClick={() => handleDelete(h._id)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayCalendar;
