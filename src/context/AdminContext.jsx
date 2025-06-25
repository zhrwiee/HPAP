import { createContext, useState } from "react";
import { toast } from "react-toastify";
import API from "../api"; // ✅ use shared axios instance

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [departments, setDepartments] = useState([]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${aToken}`
    }
  };

  const getAllDoctors = async () => {
    try {
      const { data } = await API.get('/admin/all-doctors', authHeader);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllDepartments = async () => {
    try {
      const { data } = await API.get('/admin/all-departments', authHeader);
      if (data.success) {
        setDepartments(data.departments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await API.post('/admin/change-availability', { docId }, authHeader);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); // refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await API.get('/admin/appointments', authHeader);
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await API.post('/admin/cancel-appointment', { appointmentId }, authHeader);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await API.delete(`/admin/delete-department/${id}`, authHeader);
      getAllDepartments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await API.get('/admin/dashboard', authHeader);
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken, setAToken,
    doctors, getAllDoctors,
    departments, getAllDepartments,
    changeAvailability,
    deleteDepartment,
    appointments, getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
