import React from "react";
import { MdChair } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../../apis/index";
import dayjs from "dayjs";

const BookingHistory = () => {
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    select: (res) => res.data,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-md shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f74565]"></div>
        </div>
      </div>
    );
  }

  if (isError || !bookings || bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-md shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <p className="text-gray-500 italic">No recent bookings found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h3 className="text-xl font-semibold mb-6">Your Orders</h3>

      {bookings.map((booking) => {
        const show = booking.show;
        const movie = show?.movie;
        const theater = show?.theater;
        const seatIds = booking.seats.map((s) => `${s.row}${s.number}`).join(", ");
        const tax = +(booking.totalAmount * 0.05).toFixed(2);
        const total = +(booking.totalAmount + tax).toFixed(2);

        return (
          <div
            key={booking._id}
            className="bg-white rounded-md mb-10 shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Main Ticket Card */}
            <div className="p-6 flex gap-8">
              <img
                src={movie?.posterUrl}
                alt={movie?.title}
                className="w-28 h-40 object-cover rounded shadow-sm"
              />

              <div className="border-l border-gray-200 border-dashed h-40"></div>

              <div className="flex-1 relative">
                <span className={`absolute top-0 right-0 text-sm font-medium px-2 py-0.5 rounded ${
                  booking.status === "confirmed" 
                    ? "text-green-600 bg-green-50" 
                    : booking.status === "cancelled" 
                    ? "text-red-500 bg-red-50" 
                    : "text-yellow-600 bg-yellow-50"
                }`}>
                  {booking.status === "confirmed" ? "M-Ticket" : booking.status.toUpperCase()}
                </span>

                <div className="pr-20">
                  <h4 className="text-xl font-medium text-gray-800">{movie?.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {movie?.certification} • {movie?.languages?.join(", ")} • {show?.format}
                  </p>

                  <p className="text-sm text-gray-600 mt-4">
                    {show?.date} | {show?.startTime} — {theater?.name}, {theater?.city}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {booking.seats.length}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-gray-700">
                    <MdChair size={20} className="text-gray-600" />
                    <span className="text-sm font-medium tracking-wide">{seatIds}</span>
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <p className="text-xs text-gray-400">
                    Ticket: ₹{booking.totalAmount.toFixed(2)} + Convenience Fees: ₹{tax.toFixed(2)}
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    ₹{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="bg-gray-50/50 px-8 py-4 grid grid-cols-3 gap-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Booking Date & Time
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  {dayjs(booking.createdAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Payment Method
                </p>
                <p className="text-xs text-gray-600 font-medium">Simulated</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Booking ID
                </p>
                <p className="text-xs text-gray-600 font-medium uppercase">
                  {booking._id?.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingHistory;