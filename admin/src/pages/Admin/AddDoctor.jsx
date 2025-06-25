import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [about, setAbout] = useState('')
    const [department, setDepartment] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [departmentsList, setDepartmentsList] = useState([])

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/all-departments`, {
                    headers: { aToken }
                });
                if (data.success) {
                    setDepartmentsList(data.departments);
                    if (data.departments.length > 0) {
                        setDepartment(data.departments[0].departmentname);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch departments:', err);
                toast.error('Failed to load departments');
            }
        };

        fetchDepartments();
    }, [backendUrl, aToken]);

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            // if (!docImg) {
            //     return toast.error('Image Not Selected')
            // }

            const formData = new FormData();

            if (docImg) {
                    formData.append('image', docImg)
                }
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('about', about)
            formData.append('department', department)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setAbout('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture <span className="text-xs text-gray-400">(optional)</span></p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Staff Or Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Department</p>
                            <select onChange={e => setDepartment(e.target.value)} value={department} className='border rounded px-2 py-2'>
                                {departmentsList.map((d, i) => (
                                    <option key={i} value={d.departmentname}>{d.departmentname}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about doctor'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>

            </div>

        </form>
    )
}

export default AddDoctor;
