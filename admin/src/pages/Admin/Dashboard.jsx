import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const cardClass =
    'flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all';

  return (
    dashData && (
      <div className='m-5'>
        <div className='flex flex-wrap gap-3'>
          <div onClick={() => navigate('/doctor-list')} className={cardClass}>
            <img className='w-14' src={assets.doctor_icon} alt='Doctors' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
              <p className='text-gray-400'>Doctors</p>
            </div>
          </div>

          <div onClick={() => navigate('/all-appointments')} className={cardClass}>
            <img className='w-14' src={assets.appointments_icon} alt='Appointments' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>

          <div onClick={() => navigate('/patients')} className={cardClass}>
            <img className='w-14' src={assets.patients_icon} alt='Patients' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
              <p className='text-gray-400'>Patients</p>
            </div>
          </div>

          <div onClick={() => navigate('/all-departments')} className={cardClass}>
            <img className='w-14' src={assets.department_icon} alt='Departments' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.departments}</p>
              <p className='text-gray-400'>Departments</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
