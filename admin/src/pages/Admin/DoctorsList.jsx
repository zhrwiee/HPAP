import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const {
    doctors,
    aToken,
    getAllDoctors,
    deleteDoctor,
    updateDoctorDepartment,
    getAllDepartments,
    departments,
  } = useContext(AdminContext);

  const [confirmId, setConfirmId] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllDepartments(); // ✅ Ensure department list loads
    }
  }, [aToken]);

  const handleDelete = async () => {
    try {
      await deleteDoctor(confirmId);
      toast.success('Doctor deleted');
      setConfirmId(null);
      getAllDoctors(); // Refresh
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!newDept) return toast.error('Please select a department');
      await updateDoctorDepartment(editDoctor._id, newDept);
      toast.success('Department updated');
      setEditDoctor(null);
      setNewDept('');
      getAllDoctors(); // Refresh
    } catch (err) {
      toast.error('Failed to update department');
    }
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item) => (
          <div
            key={item._id}
            className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group'
          >
            <img
              className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-[100px] object-contain p-2'
              src={item.image}
              alt={item.name}
            />
            <div className='p-4 text-center'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.departmentname}</p>
              <div className='flex justify-center gap-2 mt-3'>
                <button
                  onClick={() => {
                    setEditDoctor(item);
                    setNewDept(item.departmentname); // ✅ Pre-fill current dept
                  }}
                  className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(item._id)}
                  className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-80 text-center shadow-xl'>
            <h2 className='text-lg font-semibold mb-4 text-red-600'>Confirm Deletion</h2>
            <p className='mb-5 text-sm'>Are you sure you want to delete this doctor?</p>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDelete}
                className='bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600'
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className='bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editDoctor && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96 text-center shadow-xl'>
            <h2 className='text-lg font-semibold mb-4 text-blue-600'>Edit Department</h2>
            <p className='mb-2 text-sm'>
              Doctor: <strong>{editDoctor.name}</strong>
            </p>

            <select
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className='w-full border p-2 rounded mb-4 text-sm'
            >
              <option value=''>Select Department</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            <div className='flex justify-center gap-4'>
              <button
                onClick={handleEditSubmit}
                className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600'
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditDoctor(null);
                  setNewDept('');
                }}
                className='bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300'
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

export default DoctorsList;
