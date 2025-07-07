import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  const [openPatientIds, setOpenPatientIds] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Group appointments by patient ID
  const groupedAppointments = appointments.reduce((acc, appt) => {
    const patientId = appt.userId || appt.userData?._id || 'unknown';
    if (!acc[patientId]) acc[patientId] = [];
    acc[patientId].push(appt);
    return acc;
  }, {});

  // Sort each group by slotDate + time (ascending)
  Object.values(groupedAppointments).forEach(group => {
    group.sort((a, b) => new Date(a.slotDate + ' ' + a.slotTime) - new Date(b.slotDate + ' ' + b.slotTime));
  });

  // Sort groups by latest appointment (descending)
  const sortedGroups = Object.entries(groupedAppointments).sort(([, a], [, b]) => {
    const dateA = new Date(a[a.length - 1].slotDate + ' ' + a[a.length - 1].slotTime);
    const dateB = new Date(b[b.length - 1].slotDate + ' ' + b[b.length - 1].slotTime);
    return dateB - dateA;
  });

  // Toggle open/close
  const toggleOpen = (patientId) => {
    setOpenPatientIds((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      {/* Search Filters */}
      <div className='mb-3 flex items-center gap-2 flex-wrap'>
        <input
          type='text'
          placeholder='Search by patient or department...'
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

      {/* Appointment Table */}
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>

        {/* Header */}
        <div className='hidden sm:grid grid-cols-[2fr_2fr_2fr_1fr_0.5fr] py-3 px-6 border-b bg-gray-100'>
          <p>Patient</p>
          <p>Department</p>
          <p>Date & Time</p>
          <p>Action</p>
          <p className='text-right pr-2'>Total</p>
        </div>

        {/* Filtered Groups */}
        {sortedGroups
          .filter(([_, appts]) => {
            const patientName = (appts[0].userData?.name || '').toLowerCase();
            const dept = (appts[0].departmentname || '').toLowerCase();

            const dateMatch = appts.some(appt => {
              if (!searchDate) return true;

              const [day, month, year] = appt.slotDate.split('_');
              if (!day || !month || !year) return false;

              const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              return formatted === searchDate;
            });

            return (
              (patientName.includes(searchTerm) || dept.includes(searchTerm)) &&
              dateMatch
            );
          })
          .map(([patientId, appts]) => {
            const patient = appts[0].userData || {};

            return (
              <div key={patientId} className='border-b'>
                {/* Group Row */}
                <div
                  className='grid sm:grid-cols-[2fr_2fr_2fr_1fr_0.5fr] px-6 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 items-center'
                  onClick={() => toggleOpen(patientId)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={patient.image || assets.default_avatar}
                      className='w-8 h-8 rounded-full object-cover bg-gray-200'
                      alt="Patient"
                    />
                    <p className='font-medium'>{patient.name || 'N/A'}</p>
                  </div>
                  <p className='text-gray-400'>—</p>
                  <p className='text-gray-400'>—</p>
                  <p className='text-gray-400'>—</p>
                  <p className='text-right pr-2 font-medium'>{appts.length}</p>
                </div>

                {/* Expandable Rows */}
                {openPatientIds[patientId] &&
                  appts.map((item, index) => (
                    <div
                      key={index}
                      className='sm:grid sm:grid-cols-[2fr_2fr_2fr_1fr_0.5fr] px-6 py-3 items-center text-gray-600 hover:bg-gray-50'
                    >
                      <div className='hidden sm:block'></div>
                      <p>{item.departmentname || 'N/A'}</p>
                      <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
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
                      <p className='text-right pr-2 text-gray-400'>—</p>
                    </div>
                  ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AllAppointments;
