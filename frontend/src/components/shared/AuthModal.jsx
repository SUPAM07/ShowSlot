import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const AuthModal = ({ isOpen, onClose }) => {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await sendOtp(email);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Login successful!");
      onClose();
      setStep("email");
      setEmail("");
      setOtp("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-800 to-[#f74565] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition text-2xl cursor-pointer"
          >
            <IoClose />
          </button>
          <h2 className="text-2xl font-bold">
            {step === "email" ? "Sign In" : "Verify OTP"}
          </h2>
          <p className="text-sm mt-1 opacity-90">
            {step === "email"
              ? "Enter your email to receive a one-time password"
              : `We've sent a 6-digit OTP to ${email}`}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f74565] focus:border-transparent transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f84464] hover:bg-[#d63955] text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-[#f74565] focus:border-transparent transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f84464] hover:bg-[#d63955] text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="w-full text-sm text-gray-500 hover:text-[#f74565] transition cursor-pointer"
              >
                ← Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
