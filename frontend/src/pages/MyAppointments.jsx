import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Handles both 'D_M_YYYY' and 'YYYY-MM-DD'
  const formatDate = (slotDate) => {
    if (!slotDate) return 'Invalid date';
    let day, month, year;
    if (slotDate.includes('_')) {
      // D_M_YYYY format
      [day, month, year] = slotDate.split('_');
    } else if (slotDate.includes('-')) {
      // YYYY-MM-DD format
      [year, month, day] = slotDate.split('-');
    } else {
      return slotDate;
    }

    const dayNum = String(day).padStart(2, '0');
    const monthName = months[Number(month) - 1] || 'Invalid';
    return `${dayNum} ${monthName} ${year}`;
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching appointments');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, 
        { appointmentId }, 
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Cancel failed');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/delete-appointment/${appointmentId}`, {
        headers: { token }
      });
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    if (token) getAppointments();
  }, [token]);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-700 mt-10 mb-4 border-b pb-2">My Appointments</h2>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((item, idx) => (
            <div key={item._id || idx} className="p-4 border rounded shadow-sm flex justify-between items-center">
              <div className="text-sm">
                <p><span className="font-medium text-gray-700">Department:</span> {item.departmentname || 'N/A'}</p>
                <p><span className="font-medium text-gray-700">Date:</span> {formatDate(item.slotDate)}</p>
                <p><span className="font-medium text-gray-700">Time:</span> {item.slotTime}</p>
              </div>

              <div className="flex items-center gap-2">
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
                {item.cancelled && (
                  <>
                    <span className="text-sm text-red-500 font-medium">Cancelled</span>
                    <button
                      onClick={() => deleteAppointment(item._id)}
                      className="text-red-600 hover:text-red-800 text-sm underline"
                    >
                      Delete
                    </button>
                  </>
                )}
                {item.isCompleted && (
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
