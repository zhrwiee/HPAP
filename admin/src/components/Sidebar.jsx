import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && (
        <ul className='text-[#515151] mt-5'>

          <NavLink to='/admin-dashboard' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='Dashboard' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink to='/all-appointments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='Appointments' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink to='/appointments-today' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='Appointments' />
            <p className='hidden md:block'>Appointments Today</p>
          </NavLink>

          <NavLink to='/add-doctor' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.add_icon} alt='Add Doctor' />
            <p className='hidden md:block'>Add Doctor or Staff</p>
          </NavLink>

          <NavLink to='/doctor-list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='Doctor List' />
            <p className='hidden md:block'>Doctors or Staff List</p>
          </NavLink>

          <NavLink to='/add-department' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.addDepart_Icon} alt='Add Department' width={24} />
            <p className='hidden md:block'>Add Department</p>
          </NavLink>

          <NavLink to='/all-departments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.department_icon} alt='Department List' width={24} />
            <p className='hidden md:block'>Department List</p>
          </NavLink>

          <NavLink to='/patients' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img className='min-w-5' src={assets.patients_icon} alt='Patients' width={24} />
            <p className='hidden md:block'>Patients</p>
          </NavLink>

        </ul>
      )}

      {dToken && <ul className='text-[#515151] mt-5'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
        <NavLink to={'/list-health-record'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.patient_icon} alt='' />
          <p className='hidden md:block'>Health Records</p>
        </NavLink>

      </ul>}
    </div>
  )
}

export default Sidebar