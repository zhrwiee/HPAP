import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import API from '../../api';

const Dashboard = () => {
  const { aToken } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  const [dashData, setDashData] = useState(null);

  const getDashboardData = async () => {
    try {
      const res = await API.get('/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${aToken || localStorage.getItem('aToken')}`
        }
      });
      setDashData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashboardData();
    }
  }, [aToken]);

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

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

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.department_icon} alt="Departments" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.departments}</p>
            <p className='text-gray-400'>Departments</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
