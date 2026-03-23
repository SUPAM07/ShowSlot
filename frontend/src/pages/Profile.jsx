import React, { useState } from "react";
import { tabs } from "../utils/constants";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../apis/index";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({ name, phone });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabs */}
      <div className="bg-[#e5e5e5]">
        <div className="max-w-7xl mx-auto flex gap-6 py-3 text-sm font-medium px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 cursor-pointer ${
                activeTab === tab
                  ? "border-[#f74565] text-[#f74565]"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Page */}
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <div>
              {/* Header */}
              <div className="bg-linear-to-r from-gray-800 to-[#f74565] rounded-md px-6 py-6 flex items-center gap-6 text-white">
                <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center bg-white text-[#f74565] text-2xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <IoMdAdd size={24} className="text-gray-600" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name || "Update Your Name"}</h2>
                  <p className="text-sm opacity-80">
                    Manage your account and preferences
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white px-6 py-6 rounded-md mt-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                      <div className="flex gap-2">
                        <span>{user.email}</span>
                        <span className="text-green-600 text-xs bg-green-100 px-2 rounded">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Mobile Number</p>
                      <div className="flex gap-2">
                        <span>{user.phone ? `+91 ${user.phone}` : "Not added"}</span>
                      </div>
                    </div>
                    <FiEdit className="text-pink-500 cursor-pointer" onClick={() => setIsEditing(true)} />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-6 mt-6 rounded-md shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm text-[#f74565] font-medium cursor-pointer">
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full mt-1 border border-gray-200 rounded-md px-3 py-2 ${!isEditing ? "bg-gray-50" : "bg-white"}`}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full mt-1 border border-gray-200 rounded-md px-3 py-2 ${!isEditing ? "bg-gray-50" : "bg-white"}`}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Birthday (Optional)</label>
                    <input type="date" className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Identity (Optional)</label>
                    <div className="flex gap-2 mt-2">
                      {["Woman", "Man"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setMaritalStatus(status)}
                          className={`px-4 py-1 border rounded-md cursor-pointer ${
                            maritalStatus === status
                              ? "bg-[#f74565] text-white border-[#f74565]"
                              : "border-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleSaveProfile} className="bg-[#f84464] text-white px-6 py-2 rounded-lg font-medium text-sm cursor-pointer">
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="border border-gray-300 px-6 py-2 rounded-lg text-sm cursor-pointer">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === "Your Orders" && <BookingHistory />}
        </div>
      </div>
    </>
  );
};

export default Profile;