import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';

const DoctorListHealthRecord = () => {
  const [records, setRecords] = useState([]);
  const { dToken, backendUrl } = useContext(DoctorContext);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/doctor/health-records`, {
          headers: { dToken },
        });

        if (res.data.success) {
          setRecords(res.data.records);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch health records", err);
        toast.error("Failed to load health records");
      }
    };

    if (dToken) {
      fetchRecords();
    }
  }, [dToken, backendUrl]);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>Health Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className='overflow-x-auto bg-white shadow rounded'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='p-3'>#</th>
                <th className='p-3'>Patient Name</th>
                <th className='p-3'>Date</th>
                <th className='p-3'>Diagnosis</th>
                <th className='p-3'>Blood Pressure</th>
                <th className='p-3'>Heart Rate</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record._id} className='border-t'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{record.userId?.name || 'N/A'}</td>
                  <td className='p-3'>{new Date(record.date).toLocaleDateString()}</td>
                  <td className='p-3'>{record.diagnosis || '-'}</td>
                  <td className='p-3'>{record.bloodPressure || '-'}</td>
                  <td className='p-3'>{record.heartRate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorListHealthRecord;
