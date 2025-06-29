import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const PatientList = () => {
  const { aToken, patients = [], getAllPatients, deletePatient } = useContext(AdminContext);
  

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllPatients();
    }
  }, [aToken]);

  const confirmDelete = (id) => {
    setSelectedPatientId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deletePatient(selectedPatientId);
      toast.success('Patient deleted successfully');
      getAllPatients();
    } catch (err) {
      toast.error('Failed to delete patient');
    } finally {
      setShowModal(false);
      setSelectedPatientId(null);
    }
  };

  if (!Array.isArray(patients)) return <p className="p-5 text-gray-500">Loading patients...</p>;

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Patients</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr_1fr] py-3 px-6 border-b bg-gray-100'>
          <p>#</p>
          <p>Patient</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Gender</p>
          <p>Action</p>
        </div>

        {/* Data rows */}
        {patients.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_2fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
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

            <button
              onClick={() => confirmDelete(item._id)}
              className='text-red-500 text-sm hover:underline'
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🔴 Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-5 text-gray-600">Are you sure you want to delete this patient?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
