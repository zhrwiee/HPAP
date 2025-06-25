import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        docId: profileData._id,
        name: profileData.name,
        address: profileData.address,
        about: profileData.about,
        available: profileData.available,
      };

      if (profileData.newPassword && profileData.newPassword.length >= 6) {
        updateData.password = profileData.newPassword;
      }

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dToken },
      });

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Update failed');
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div className="m-5">
      <div className="flex flex-col gap-4">
        <div>
          <img className="bg-primary/80 w-full sm:max-w-64 rounded-lg" src={profileData.image} alt="" />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {isEdit ? (
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{profileData.name}</p>
            )}
          </div>

          {/* Degree & Speciality */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{profileData.experience}</button>
          </div>

          {/* About */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">About</label>
            {isEdit ? (
              <textarea
                className="w-full mt-1 p-2 border rounded"
                rows={6}
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, about: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-700 mt-1">{profileData.about}</p>
            )}
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            {isEdit ? (
              <>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  placeholder="Address line 1"
                />
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded"
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  placeholder="Address line 2"
                />
              </>
            ) : (
              <p className="text-gray-700 mt-1">
                {profileData.address.line1}<br />
                {profileData.address.line2}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={profileData.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
            />
            <label className="text-sm text-gray-700">Available</label>
          </div>

          {/* Password */}
          {isEdit && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded"
                placeholder="Leave empty to keep current password"
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
            </div>
          )}

          {/* Edit / Save Button */}
          <div className="mt-6">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
