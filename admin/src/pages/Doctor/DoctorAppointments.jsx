import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const DoctorAppointmentsToday = () => {
  const navigate = useNavigate();
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge } = useContext(AppContext);

  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  useEffect(() => {
    const today = new Date();
    const formattedToday = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

    const filtered = appointments.filter(
      (appt) => appt.slotDate === formattedToday && !appt.cancelled
    );

    setTodayAppointments(filtered);
  }, [appointments]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Today's Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.3fr_2fr_1fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-100 font-medium text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date</p>
          <p>Time</p>
          <p>Symptoms</p>
          <p>Referral</p>
          <p>Department</p>
          <p>Action</p>
        </div>

        {todayAppointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.3fr_2fr_1fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover' alt="Patient" />
              <p>{item.userData.name}</p>
            </div>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)} yrs</p>
            <p>{slotDateFormat(item.slotDate)}</p>
            <p>{item.slotTime}</p>

            <p>
              {item.symptoms.join(', ')}
              {item.otherSymptom && `, ${item.otherSymptom}`}
            </p>

            <p>
              {item.referralLetter ? (
                <a
                  href={item.referralLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-blue-500 hover:underline'
                >
                  View
                </a>
              ) : (
                <span className='text-gray-400'>None</span>
              )}
            </p>

            <p>{item.departmentname}</p>

            <div className='flex items-center gap-2'>
              {!item.isCompleted && (
                <>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-6 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                    title="Cancel"
                  />
                  <img
                    onClick={() => navigate('/doctor/health-record', { state: { appointmentId: item._id, userId: item.userId } })}
                    className='w-6 cursor-pointer'
                    src={assets.tick_icon}
                    alt="Complete"
                    title="Add Health Record"
                  />
                </>
              )}
              {item.isCompleted && (
                <span className='text-green-500 text-xs font-medium'>Completed</span>
              )}
            </div>

          </div>
        ))}

        {todayAppointments.length === 0 && (
          <div className='text-center py-8 text-gray-400'>No appointments for today.</div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsToday;
