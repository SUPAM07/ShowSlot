import React, { useEffect, useRef, useState } from "react";
import Header from "../components/seat-layout/Header.jsx";
import dayjs from "dayjs";
import { calculateTotalPrice, groupSeatsByType } from "../utils";
import { createBooking } from "../apis/index";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useSeatContext } from "../context/SeatContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";

const Checkout = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { location } = useLocation();
  const { selectedSeats, shows: showData, setSelectedSeats } = useSeatContext();
  const { base, tax, total } = calculateTotalPrice(selectedSeats);
  const selectedSeatsRef = useRef(selectedSeats);
  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    if (!showData || selectedSeats.length === 0) {
      navigate("/");
    }
  }, [showData, selectedSeats, navigate]);

  useEffect(() => {
    // Redirect to home if seats get unlocked externally (e.g. socket disconnection)
    const handleSeatUnlocked = ({ seatIds }) => {
      const ourSeatsUnlocked = selectedSeatsRef.current.some((id) => seatIds.includes(id));
      if (ourSeatsUnlocked) {
        toast.error("Your seat selection was lost. Please try again.");
        navigate("/");
      }
    };

    socket.on("seat-unlocked", handleSeatUnlocked);
    return () => {
      socket.off("seat-unlocked", handleSeatUnlocked);
    };
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          socket.emit("unlock-seats", {
            showId: showData?._id,
            userId: user?._id
          });
          toast.error("Time expired!");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showData?._id, user?._id, navigate]);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your booking");
      return;
    }
    setPaying(true);
    try {
      // Convert seat IDs like "A1", "B12" to { row: "A", number: 1 }
      const seatObjects = selectedSeats.map(seatId => ({
        row: seatId.charAt(0),
        number: parseInt(seatId.slice(1)),
      }));

      await createBooking(showData._id, seatObjects, "Simulated");
      toast.success("🎉 Booking confirmed!");
      setSelectedSeats([]);
      navigate("/Profile");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-red-500 text-center mb-3 text-lg border rounded-[14px] border-dashed py-2 font-semibold">
          Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={showData?.movie?.posterUrl}
                alt={showData?.movie?.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {showData?.movie?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {showData?.movie?.certification} •{" "}
                  {showData?.movie?.languages?.join(", ")} •{" "}
                  {showData?.movie?.format?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  {showData?.theater?.name}, {showData?.theater?.city},{" "}
                  {showData?.theater?.state}
                </p>
              </div>
            </div>
            {/* Show Details */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(showData?.date, "DD-MM-YYYY")
                  .format("D MMMM YYYY")
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                &nbsp;•{" "}
                <span className="font-semibold">{showData?.startTime}</span>
              </p>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats.length} ticket{selectedSeats.length > 1 ? "s" : ""}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {groupSeatsByType(selectedSeats).map(
                        ({ type, seats }) => (
                          <p key={type} className="font-medium">
                            {type} - {seats.join(", ")}
                          </p>
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-md font-semibold mt-2">
                  <span className="text-gray-700">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-white border rounded-[24px] border-gray-200 text-yellow-800 text-sm px-6 py-5 tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} /> No cancellation or refund available
                after payment.
              </span>
            </div>

            {/* Offers */}
            <div className="flex items-center justify-between border rounded-[24px] border-gray-200 px-6 py-5">
              <p className="font-medium text-sm flex items-center gap-2">
                <BiSolidOffer size={20} /> Available Offers
              </p>
              <p className="text-sm text-center text-blue-600 font-medium cursor-pointer">
                View all offers
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>
            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹{base}</span>
              </div>
              <div className="flex justify-between text-md pb-4">
                <span className="font-semibold text-sm">Taxes & fees (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                <span>To be paid</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* User details */}
            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user?.name || user?.email?.split("@")[0]}</p>
                <p className="text-sm text-gray-600">{user?.phone ? `+91-${user.phone}` : ""}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>

            {/* Terms and button */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying}
              className="w-full flex justify-between items-center bg-black hover:bg-gray-900 rounded-[24px] px-6 py-4 cursor-pointer transition disabled:opacity-50"
            >
              <p className="text-white font-bold">
                ₹{total} <span className="text-xs font-medium">TOTAL</span>
              </p>
              <p className="text-white font-medium">
                {paying ? "Processing..." : "Proceed To Pay"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;