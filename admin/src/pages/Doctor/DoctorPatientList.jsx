import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorPatientList = () => {
  const { patients, getPatients } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        await getPatients();
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>My Patients</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.3fr_2fr_1fr_2fr_2fr_2fr] gap-1 py-3 px-6 border-b bg-gray-100 font-medium text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Gender</p>
        </div>

        {/* Loading */}
        {loading ? (
          <p className='p-4 text-gray-400'>Loading...</p>
        ) : Array.isArray(patients) && patients.length > 0 ? (
          patients.map((p, index) => (
            <div
              key={index}
              className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.3fr_2fr_1fr_2fr_2fr_2fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* Patient Info */}
              <div className='flex items-center gap-2'>
                <img
                  src={p.image || assets.user_icon}
                  className='w-8 h-8 rounded-full object-cover'
                  alt='Patient'
                />
                <p>{p.name}</p>
              </div>

              <p className='max-sm:hidden'>{p.dob ? `${calculateAge(p.dob)} yrs` : '-'}</p>
              <p>{p.email || '-'}</p>
              <p>{p.phone || '-'}</p>
              <p>{p.gender || '-'}</p>
            </div>
          ))
        ) : (
          <p className='p-4 text-gray-400'>No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientList;
