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

        const getAllDepartmentsDoctor = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors-departments`, {
        headers: { aToken }
        });

        if (data.success) {
        setDepartments(data.departments); // should be the array of department names
        } else {
        toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
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

    
  const updateDoctorDepartment = async (id, department) => {
  const res = await fetch(`${backendUrl}/api/admin/doctors/${id}/department`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      aToken,
    },
    body: JSON.stringify({ department }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update doctor');
  }

  return data.doctor;
};

    // AdminContext.js

const getHolidays = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/admin/holidays`, {
      headers: { aToken },
    });
    return data.holidays;
  } catch (error) {
    console.error("Fetch holidays error:", error.message);
    return [];
  }
};

const addHoliday = async (holiday) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/admin/add-holiday`, holiday, {
      headers: { aToken },
    });
    toast.success(data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return false;
  }
};

const deleteHoliday = async (holidayId) => {
  try {
    const { data } = await axios.delete(`${backendUrl}/api/admin/holiday/${holidayId}`, {
      headers: { aToken },
    });
    toast.success(data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return false;
  }
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

    const getAppointmentsToday = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/admin/appointments-today`, {
      headers: { aToken }
    });

    if (data.success) {
      return data.appointments;
    } else {
      toast.error(data.message);
      return [];
    }
  } catch (error) {
    toast.error(error.message);
    return [];
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
            updateDoctorDepartment,
            deleteDepartment,
            changeAvailability,
            departments, getAllDepartments,
            appointments,
            getAllAppointments,
            getDashData,
            getAppointmentsToday,
            getAllPatients,
            cancelAppointment,
            addHoliday,
            getHolidays,
            deleteHoliday,
            getAllDepartmentsDoctor,
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