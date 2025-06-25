import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_1fr] py-3 px-6 border-b bg-gray-100'>
          <p>#</p>
          <p>Patient</p>
          <p>Department</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>

        {/* Data rows */}
        {appointments.map((item, index) => {
          const patient = item.userData || {};

          return (
            <div
              key={index}
              className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
            >
              {/* Index */}
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* Patient Info */}
              <div className='flex items-center gap-2'>
                <img
                  src={patient.image || assets.default_avatar}
                  className='w-8 h-8 rounded-full object-cover bg-gray-200'
                  alt="Patient"
                />
                <p>{patient.name || 'N/A'}</p>
              </div>

              {/* Department */}
              <p>{item.departmentname || 'N/A'}</p>

              {/* Date & Time */}
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              {/* Action */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-600 text-xs font-medium'>Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    src={assets.cancel_icon}
                    alt="Cancel"
                    className='w-6 cursor-pointer hover:scale-110 transition-transform'
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllAppointments;
