import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DepartmentList = () => {
  const {
    departments,
    aToken,
    getAllDepartments,
    deleteDepartment,
    backendUrl,
  } = useContext(AdminContext);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ departmentname: '', image: null });

  useEffect(() => {
    if (aToken) {
      getAllDepartments();
    }
  }, [aToken]);

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      toast.success('Department deleted');
      setConfirmDeleteId(null);
      getAllDepartments();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete department');
    }
  };

  const handleEditSubmit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('departmentname', editForm.departmentname);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await axios.post(`${backendUrl}/api/admin/update-department/${id}`, formData, {
        headers: {
          token: aToken, // ✅ DO NOT manually set Content-Type
        },
      });



      toast.success('Department updated');
      setEditId(null);
      getAllDepartments();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update department');
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({ departmentname: item.departmentname, image: null });
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Departments</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {departments.map((item) => (
          <div
            className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group relative'
            key={item._id}
          >
            <img
              className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-[100px] object-contain p-2'
              src={item.image}
              alt={item.departmentname}
            />

            <div className='p-4 text-center'>
              {editId === item._id ? (
                <div className='flex flex-col gap-2 text-sm'>
                  <input
                    type='text'
                    value={editForm.departmentname}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, departmentname: e.target.value }))
                    }
                    className='border rounded px-2 py-1 text-sm'
                  />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, image: e.target.files[0] }))
                    }
                    className='text-xs'
                  />
                  <div className='flex justify-center gap-2 mt-2'>
                    <button
                      onClick={() => handleEditSubmit(item._id)}
                      className='bg-blue-500 text-white px-3 py-1 rounded'
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className='bg-gray-200 text-gray-700 px-3 py-1 rounded'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-[#262626] text-lg font-medium'>{item.departmentname}</p>

                  {confirmDeleteId === item._id ? (
                    <div className='mt-2 flex flex-col gap-2'>
                      <p className='text-sm text-red-600'>Confirm delete?</p>
                      <div className='flex justify-center gap-3'>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className='text-white bg-red-500 px-3 py-1 rounded text-sm'
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className='text-gray-600 bg-gray-200 px-3 py-1 rounded text-sm'
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                   <div className="mt-2 flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(item)}
                      className='text-blue-600 text-sm underline'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(item._id)}
                      className='text-red-600 text-sm underline'
                    >
                      Delete
                    </button>
                  </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;
