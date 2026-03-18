import React from "react";
import { MdChair } from "react-icons/md";
// Ensure this path matches where you saved the code you just shared
import { ordersData } from "../../utils/constants"; 

const BookingHistory = () => {
  // Guard clause in case data hasn't loaded or is empty
  if (!ordersData || ordersData.length === 0) {
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

      {ordersData.map((order) => (
        <div 
          key={order.id} 
          className="bg-white rounded-md mb-10 shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Main Ticket Card */}
          <div className="p-6 flex gap-8">
            <img 
              src={order.poster} 
              alt={order.title} 
              className="w-28 h-40 object-cover rounded shadow-sm" 
            />
            
            <div className="border-l border-gray-200 border-dashed h-40"></div>

            <div className="flex-1 relative">
              <span className="absolute top-0 right-0 text-gray-600 text-sm font-medium">
                M-Ticket
              </span>

              <div className="pr-20">
                <h4 className="text-xl font-medium text-gray-800">{order.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{order.format}</p>
                
                <p className="text-sm text-gray-600 mt-4">
                  {order.datetime} — {order.cinema}
                </p>
                
                <p className="text-xs text-gray-500 mt-1">
                  Quantity: {order.quantity}
                </p>

                <div className="flex items-center gap-2 mt-4 text-gray-700">
                  <MdChair size={20} className="text-gray-600" />
                  <span className="text-sm font-medium tracking-wide">
                    {order.seats}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-right">
                <p className="text-xs text-gray-400">
                  Ticket: ₹{order.ticket.toFixed(2)} + Convenience Fees: ₹{order.fee.toFixed(2)}
                </p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  ₹{order.total.toFixed(2)}
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
              <p className="text-xs text-gray-600 font-medium">{order.bookingTime}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                Payment Method
              </p>
              <p className="text-xs text-gray-600 font-medium">{order.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                Booking ID
              </p>
              <p className="text-xs text-gray-600 font-medium uppercase">{order.id}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;