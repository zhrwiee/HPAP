import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorPatientList = () => {
  const { patients = [], getPatients } = useContext(DoctorContext);

  useEffect(() => {
    getPatients();
  }, []);

  if (!Array.isArray(patients)) return <p className="p-5 text-gray-500">Loading patients...</p>;

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>My Patients</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr] py-3 px-6 border-b bg-gray-100 font-medium text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Gender</p>
        </div>

        {/* Data rows */}
        {patients.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_2fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img
                src={item.image || assets.default_avatar}
                className='w-8 h-8 rounded-full object-cover bg-gray-200'
                alt="Patient"
              />
              <p>{item.name || 'N/A'}</p>
            </div>
            <p>{item.email || 'N/A'}</p>
            <p>{item.phone || '-'}</p>
            <p>{item.gender || 'Not Selected'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPatientList;
