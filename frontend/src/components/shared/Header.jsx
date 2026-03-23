import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiUser, FiLogOut } from "react-icons/fi";
import mainLogo from "../../assets/main-icon.png";
import { useLocation } from "../../context/LocationContext";
import map from "../../assets/pin.gif";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "./AuthModal";

const Header = () => {
  const { location, loading, error } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className="w-full text-sm bg-white">
        {/* Top Navbar */}
        <div className="px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-3">

            {/* Left Part */}
            <div className="flex items-center space-x-4">
              <img
                onClick={() => navigate("/")}
                src={mainLogo}
                alt="logo"
                className="h-8 object-contain cursor-pointer"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  className="border border-gray-300 rounded px-4 py-1.5 w-100 text-sm outline-none"
                />
                <FaSearch className="absolute right-2 top-2.5 text-gray-500" />
              </div>
            </div>

            {/* Right Part */}
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium cursor-pointer flex items-center">
                {loading ? (
                  <img src={map} alt="loading..." className="w-6 h-6 animate-pulse" />
                ) : (
                  location && (
                    <p className="flex items-center">
                      {location}
                      <span className="ml-1 text-[10px]">▼</span>
                    </p>
                  )
                )}
              </div>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f84464] flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:inline">
                      {user.name || user.email.split("@")[0]}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                      <button
                        onClick={() => { navigate("/Profile"); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <FiUser className="text-gray-500" /> Profile
                      </button>
                      <button
                        onClick={() => { logout(); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500 flex items-center gap-2 cursor-pointer"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#f84464] hover:bg-[#d63955] transition-colors cursor-pointer text-white px-4 py-1.5 rounded text-sm font-semibold"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navbar */}
        <div className="bg-[#f2f2f2] px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-2 text-gray-700">
            <div className="flex items-center space-x-6 font-medium">
              <span onClick={() => navigate("/movies")} className="cursor-pointer hover:text-red-500">Movies</span>
              <span className="cursor-pointer hover:text-red-500">Stream</span>
              <span className="cursor-pointer hover:text-red-500">Events</span>
              <span className="cursor-pointer hover:text-red-500">Plays</span>
              <span className="cursor-pointer hover:text-red-500">Sports</span>
              <span className="cursor-pointer hover:text-red-500">Activities</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="cursor-pointer hover:underline">ListYourShow</span>
              <span className="cursor-pointer hover:underline">Corporates</span>
              <span className="cursor-pointer hover:underline">Offers</span>
              <span className="cursor-pointer hover:underline">Gift Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;