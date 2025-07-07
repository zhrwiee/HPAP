import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AppointmentToday = () => {
  const { getAppointmentsToday, cancelAppointment } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAppointmentsToday();
      setAppointments(data);
    })();
  }, []);

  return (
    <div className='m-5 max-w-6xl'>
      <h2 className='text-lg font-semibold mb-4'>Today's Appointments</h2>
      <div className='bg-white border rounded text-sm'>
        <div className='grid grid-cols-[2fr_2fr_2fr_1fr] px-6 py-2 bg-gray-100 font-medium'>
          <p>Patient</p>
          <p>Department</p>
          <p>Time</p>
          <p>Action</p>
        </div>
        {appointments.length === 0 ? (
          <p className='p-4 text-gray-500'>No appointments today.</p>
        ) : (
          appointments.map((item, idx) => (
            <div key={idx} className='grid grid-cols-[2fr_2fr_2fr_1fr] px-6 py-2 border-t items-center text-gray-600'>
              <div className='flex items-center gap-2'>
                <img
                  src={item.userData?.image || assets.default_avatar}
                  className='w-7 h-7 rounded-full object-cover bg-gray-200'
                />
                <p>{item.userData?.name || 'N/A'}</p>
              </div>
              <p>{item.departmentname}</p>
              <p>{item.slotTime}</p>
              <div>
                {item.cancelled ? (
                  <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-600 text-xs font-medium'>Completed</p>
                ) : (
                  <img
                    src={assets.cancel_icon}
                    alt='Cancel'
                    onClick={() => cancelAppointment(item._id)}
                    className='w-6 cursor-pointer hover:scale-110 transition-transform'
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentToday;
