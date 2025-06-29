import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)
    const [departments, setDepartments] = useState([])
    const [patients, setPatients] = useState([]);

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }


    const getAllPatients = async () => {
    const res = await axios.get(`${backendUrl}/api/admin/get-all-patients`, {
        headers: { aToken }
    });
    if (res.data.success) setPatients(res.data.data);
    };

    const getAllDepartments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-departments`, {
                headers: { aToken }
            })
            if (data.success) {
                setDepartments(data.departments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


        const deleteDoctor = async (id) => {
    await fetch(`${backendUrl}/api/admin/delete-doctor/${id}`, {
        method: 'DELETE',
        headers: { aToken },
    });
    };

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }
    const deleteDepartment = async (id) => {
  await fetch(`${backendUrl}/api/admin/delete-department/${id}`, {
    method: 'DELETE',
    headers: { aToken },
  });
};
       const deletePatient = async (id) => {
  try {
    const { data } = await axios.delete(`${backendUrl}/api/admin/delete-patient/${id}`, {
      headers: { aToken },
    });

    if (data.success) {
      toast.success("Patient deleted successfully");
      getAllPatients(); // refresh list
    } else {
      toast.error(data.message || "Failed to delete patient");
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};


    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

            const value = {
            aToken, setAToken,
            doctors,
            getAllDoctors,
            deleteDoctor,
            deleteDepartment,
            changeAvailability,
            departments, getAllDepartments,
            appointments,
            getAllAppointments,
            getDashData,
            getAllPatients,
            cancelAppointment,
            deletePatient,
            dashData,
            patients,
            backendUrl, // ✅ add this line
            }


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider