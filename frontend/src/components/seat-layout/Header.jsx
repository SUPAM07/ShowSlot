import React from 'react';
import { FiUser } from "react-icons/fi";
import logo from "../../assets/bookMyScreen.png";

const Header = ({ showData }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between shadow-sm relative min-h-[64px]">
      
      {/* Left Base: Logo */}
      <div className="flex-1 flex items-center">
        <img src={logo} alt="Logo" className="w-[140px] object-contain" />
      </div>

      {/* Center: Movie Title & Meta */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
          {showData?.movie?.title || "Movie"}
        </h1>
        <p className="text-[10px] md:text-[11px] text-gray-500 font-medium">
          {showData?.theater?.name || "Theater"} | {showData?.date} • {showData?.startTime}
        </p>
      </div>

      {/* Right Base: Profile Icon */}
      <div className="flex-1 flex items-center justify-end">
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600">
          <FiUser className="text-lg" />
        </div>
      </div>

    </div>
  );
};

export default Header;
