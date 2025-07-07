import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [healthRecords, setHealthRecords] = useState([]);

        const getAllHealthRecords = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/health-records', {
            headers: { dToken },
            });

            if (data.success) {
            setHealthRecords(data.records); // optional — only if you're using this state
            return data; // ✅ RETURN the data to the caller
            } else {
            toast.error(data.message);
            return null; // ⛔ avoid destructuring undefined
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            return null;
        }
        };

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const [patients, setPatients] = useState([]);

    const getPatients = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/doctor/patients', {headers: { dToken }});

        if (data.success) {
        setPatients(data.patients);
        } else {
        toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
    };

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

            const addHealthRecord = async (record) => {
        try {
            const { data } = await axios.post(
            backendUrl + '/api/doctor/add-health-record',
            record,
            { headers: { dToken } }
            );

            if (data.success) {
            toast.success(data.message);
            } else {
            toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
        };
    // Function to cancel doctor appointment using API
        const cancelAppointment = async (appointmentId) => {
            try {
                const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, {
                    appointmentId
                }, {
                headers: { dToken },
                });

                if (data.success) {
                toast.success(data.message);
                getAppointments(); // Refresh list
                } else {
                toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
            };

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

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
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        addHealthRecord,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
        healthRecords, getAllHealthRecords,
        getPatients
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )


}

export default DoctorContextProvider