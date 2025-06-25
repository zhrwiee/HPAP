import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData
  } = useContext(DoctorContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-10 rounded border'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="List Icon" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'>
              <img className='rounded-full w-10 h-10 object-cover' src={item.userData?.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData?.name}</p>
                <p className='text-gray-600'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {/* Status or buttons removed as requested */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
