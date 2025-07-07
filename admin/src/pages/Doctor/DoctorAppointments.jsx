import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const { dToken, appointments, getAppointments, cancelAppointment } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge } = useContext(AppContext);

  const [openPatientIds, setOpenPatientIds] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const groupedAppointments = appointments.reduce((acc, appt) => {
    const patientId = appt.userId || appt.userData?._id || 'unknown';
    if (!acc[patientId]) acc[patientId] = [];
    acc[patientId].push(appt);
    return acc;
  }, {});

  Object.values(groupedAppointments).forEach(group => {
    group.sort((a, b) => new Date(a.slotDate + ' ' + a.slotTime) - new Date(b.slotDate + ' ' + b.slotTime));
  });

  const sortedGroups = Object.entries(groupedAppointments).sort(([, a], [, b]) => {
    const dateA = new Date(a[a.length - 1].slotDate + ' ' + a[a.length - 1].slotTime);
    const dateB = new Date(b[b.length - 1].slotDate + ' ' + b[b.length - 1].slotTime);
    return dateB - dateA;
  });

  const toggleOpen = (patientId) => {
    setOpenPatientIds((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      {/* Search and Date Filter */}
      <div className='mb-3 flex items-center gap-2 flex-wrap'>
        <input
          type='text'
          placeholder='Search by patient name...'
          className='border p-2 rounded w-full max-w-md text-sm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <input
          type='date'
          className='border p-2 rounded text-sm'
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[2fr_2fr_1fr_0.5fr] py-3 px-6 border-b bg-gray-100'>
          <p>Patient</p>
          <p>Date & Time</p>
          <p>Action</p>
          <p className='text-right pr-2'>Total</p>
        </div>

        {sortedGroups
          .filter(([_, appts]) => {
            const name = (appts[0].userData?.name || '').toLowerCase();

            const dateMatch = appts.some(appt => {
              if (!searchDate) return true;
              const [d, m, y] = appt.slotDate.split('_');
              const formatted = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
              return formatted === searchDate;
            });

            return name.includes(searchTerm) && dateMatch;
          })
          .map(([patientId, appts]) => {
            const patient = appts[0].userData || {};
            return (
              <div key={patientId} className='border-b'>
                {/* Patient Header */}
                <div
                  className='grid sm:grid-cols-[2fr_2fr_1fr_0.5fr] px-6 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 items-center'
                  onClick={() => toggleOpen(patientId)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={patient.image || assets.default_avatar}
                      className='w-8 h-8 rounded-full object-cover bg-gray-200'
                      alt="Patient"
                    />
                    <div>
                      <p className='font-medium'>{patient.name || 'N/A'}</p>
                      <p className='text-xs text-gray-500'>{calculateAge(patient.dob)} yrs</p>
                    </div>
                  </div>
                  <p className='text-gray-400'>—</p>
                  <p className='text-gray-400'>—</p>
                  <p className='text-right pr-2 font-medium'>{appts.length}</p>
                </div>

                {/* Appointments */}
                {openPatientIds[patientId] &&
                  appts.map((item, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 px-6 py-4 border-t bg-white hover:bg-gray-50 text-sm text-gray-700'
                    >
                      <div className='mb-1'>
                        <strong>Date & Time:</strong> {slotDateFormat(item.slotDate)}, {item.slotTime}
                      </div>

                      <div className='mb-1'>
                        <strong>Symptoms:</strong> {item.symptoms.join(', ')}
                        {item.otherSymptom && `, ${item.otherSymptom}`}
                      </div>

                      <div className='mb-1'>
                        <strong>Referral Letter:</strong>{' '}
                        {item.referralLetter ? (
                          <a
                            href={item.referralLetter}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 underline'
                          >
                            View
                          </a>
                        ) : (
                          <span className='text-gray-500'>Not Provided</span>
                        )}
                      </div>

                      <div className='mb-1'>
                        <strong>Status:</strong>{' '}
                        {item.cancelled ? (
                          <span className='text-red-500 font-medium'>Cancelled</span>
                        ) : item.isCompleted ? (
                          <span className='text-green-600 font-medium'>Completed</span>
                        ) : (
                          <span className='text-yellow-600 font-medium'>Pending</span>
                        )}
                      </div>

                      <div className='flex items-center gap-3 mt-2'>
                        {!item.cancelled && !item.isCompleted && (
                          <>
                            <img
                              onClick={() => cancelAppointment(item._id)}
                              src={assets.cancel_icon}
                              alt='Cancel'
                              className='w-6 cursor-pointer hover:scale-110 transition-transform'
                              title='Cancel Appointment'
                            />
                            <img
                              onClick={() =>
                                navigate('/doctor/health-record', {
                                  state: { appointmentId: item._id, userId: item.userId }
                                })
                              }
                              src={assets.tick_icon}
                              alt='Complete'
                              className='w-6 cursor-pointer hover:scale-110 transition-transform'
                              title='Mark as Completed'
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DoctorAppointments;
