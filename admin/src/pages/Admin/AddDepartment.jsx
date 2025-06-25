import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { AdminContext } from '../../context/AdminContext'

const AddDepartment = () => {
  const [departmentname, setdepartmentName] = useState('')
  const [image, setIcon] = useState(false)

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!departmentname) {
      return toast.error('Please enter department name')
    }

    try {
      const formData = new FormData()
      formData.append('departmentname', departmentname)
      if (image) {
        formData.append('image', image)
      }

      // Optional: Debugging log
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })

      const { data } = await axios.post(backendUrl + '/api/admin/add-department', formData,{ headers: { aToken } })

      if (data.success) {
        toast.success(data.message)
        setdepartmentName('')
        setIcon(false)
      } else {
        toast.error(data.message || 'Failed to add department')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while adding department')
    }
  }

  return (
    <>
  <h2 className="text-xl font-semibold mb-4 text-center">Add Department</h2>

  <form
    onSubmit={onSubmitHandler}
    className="max-w-xl mx-auto p-6 bg-white shadow-md rounded"
  >
    <div className="mb-4">
      <label className="block mb-1">Department Name</label>
      <input
        type="text"
        value={departmentname}
        onChange={e => setdepartmentName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="e.g. Cardiology"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1">Upload Icon (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setIcon(e.target.files[0])}
        className="w-full"
      />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="mt-2 w-16 h-16 object-cover rounded"
        />
      )}
    </div>

    <button
      type="submit"
      className="bg-primary text-white px-6 py-2 rounded-full"
    >
      Add Department
    </button>
  </form>
  </>
  )
}

export default AddDepartment
