import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

const HolidayCalendar = () => {
  const { getHolidays, addHoliday, deleteHoliday } = useContext(AdminContext);
  const [holidays, setHolidays] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // For delete popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  const handleAdd = async () => {
    if (!title || !date) return alert('Title and date are required');
    const formattedDate = new Date(date).toLocaleDateString('en-GB').split('/').reverse().join('_');
    const success = await addHoliday({ title, date: formattedDate, isPublic });
    if (success) {
      setTitle('');
      setDate('');
      setIsPublic(false);
      fetchHolidays();
    }
  };

  const confirmDelete = (holiday) => {
    setSelectedHoliday(holiday);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedHoliday) return;
    const success = await deleteHoliday(selectedHoliday._id);
    if (success) {
      fetchHolidays();
      setShowConfirm(false);
      setSelectedHoliday(null);
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
              onClick={() => confirmDelete(h)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Delete Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{selectedHoliday?.title}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;
