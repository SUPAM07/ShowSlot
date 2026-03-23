import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ isSelected, selectedSeats, showData, state }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center bg-white h-full px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-100">
      {isSelected ? (
        <div className="w-full flex justify-between items-center">
          <div className="text-[15px] font-medium text-gray-800">
            {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-black hover:bg-gray-800 text-white px-8 md:px-12 py-3 rounded-lg text-[15px] font-semibold transition-colors cursor-pointer"
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className="w-full text-center text-gray-400 font-medium py-2">
           Select seats to proceed
        </div>
      )}
    </div>
  );
};

export default Footer;
