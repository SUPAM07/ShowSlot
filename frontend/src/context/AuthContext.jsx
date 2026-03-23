import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, loginUser, registerUser, logoutUser } from "../apis/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-fetch profile on mount (if token exists in cookies)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Send OTP
  const sendOtp = async (email) => {
    const res = await registerUser(email);
    return res.data;
  };

  // Verify OTP and login
  const verifyOtp = async (email, otp) => {
    const res = await loginUser(email, otp);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, sendOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
