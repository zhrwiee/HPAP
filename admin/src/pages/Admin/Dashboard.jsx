import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  const cardClass =
    'flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all';

  if (!dashData) {
    return (
      <div className="m-5">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const {
    appointments = 0,
    upcomingAppointments = 0,
    avgPerDay = 0,
    patients = 0,
    totalDoctors = 0,
    availableDoctors = 0,
    latestAppointment,
  } = dashData;

  return (
    <div className="m-5 flex flex-col gap-6">
      {/* Cards */}
      <div className="flex flex-wrap gap-3">
        {/* Total Appointments */}
        <div onClick={() => navigate('/all-appointments')} className={cardClass}>
          <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{appointments}</p>
            <p className="text-gray-400">Total Appointments</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className={cardClass}>
          <img
            className="w-14"
            src={assets.upcoming_icon || assets.clock_icon}
            alt="Upcoming"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">{upcomingAppointments}</p>
            <p className="text-gray-400">Upcoming Appointments</p>
          </div>
        </div>

        {/* Avg per Day */}
        <div className={cardClass}>
          <img
            className="w-14"
            src={assets.stats_icon || assets.analytics_icon}
            alt="Analytics"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">{avgPerDay}</p>
            <p className="text-gray-400">Avg/Day (7 days)</p>
          </div>
        </div>

        {/* Total Patients */}
        <div onClick={() => navigate('/patients')} className={cardClass}>
          <img className="w-14" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>

        {/* Doctor Availability */}
        <div className={cardClass}>
          <img className="w-14" src={assets.doctor_icon} alt="Doctor Status" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {availableDoctors} / {totalDoctors}
            </p>
            <p className="text-gray-400">Doctors Available</p>
          </div>
        </div>
      </div>

      {/* Latest Booking */}
      <div className="bg-white border rounded p-5 max-w-3xl">
        <h2 className="text-lg font-semibold mb-3">Latest Appointment</h2>
        {latestAppointment ? (
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            {/* Patient Image */}
            {latestAppointment.userData?.image && (
              <img
                src={latestAppointment.userData.image}
                alt="Patient"
                className="w-12 h-12 rounded-full object-cover mb-1"
              />
            )}

            <p>
              <span className="font-medium">Patient:</span>{' '}
              {latestAppointment.userData?.name || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Department:</span>{' '}
              {latestAppointment.departmentname || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Date & Time:</span>{' '}
              {latestAppointment.slotDate
                ? slotDateFormat(latestAppointment.slotDate)
                : 'N/A'}
              , {latestAppointment.slotTime || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              {latestAppointment.cancelled ? (
                <span className="text-red-500">Cancelled</span>
              ) : latestAppointment.isCompleted ? (
                <span className="text-green-600">Completed</span>
              ) : (
                <span className="text-yellow-500">Upcoming</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">No recent appointment found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
