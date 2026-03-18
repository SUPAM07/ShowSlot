import React, { useState } from "react";
import { tabs } from "../utils/constants";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory"; // ✅ REAL COMPONENT

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [maritalStatus, setMaritalStatus] = useState(null);

  return (
    <>
      {/* Tabs */}
      <div className="bg-[#e5e5e5]">
        <div className="max-w-7xl mx-auto flex gap-6 py-3 text-sm font-medium px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 ${
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
                <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center bg-white text-gray-600">
                  <IoMdAdd size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Amrit Raj</h2>
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
                      <p className="text-xs text-gray-500 uppercase font-bold">
                        Email Address
                      </p>
                      <div className="flex gap-2">
                        <span>testemail@gmail.com</span>
                        <span className="text-green-600 text-xs bg-green-100 px-2 rounded">
                          Verified
                        </span>
                      </div>
                    </div>
                    <FiEdit className="text-pink-500 cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">
                        Mobile Number
                      </p>
                      <div className="flex gap-2">
                        <span>+91 9122222222</span>
                        <span className="text-green-600 text-xs bg-green-100 px-2 rounded">
                          Verified
                        </span>
                      </div>
                    </div>
                    <FiEdit className="text-pink-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-6 mt-6 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value="Amrit Raj"
                      readOnly
                      className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Birthday (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Identity (Optional)
                    </label>
                    <div className="flex gap-2 mt-2">
                      {["Woman", "Man"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setMaritalStatus(status)}
                          className={`px-4 py-1 border rounded-md ${
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