import React, { useState } from 'react';
import dayjs from 'dayjs';
import { filters } from '../../utils/constants';
import { getShowsByMovieAndLocation } from '../../apis';
import { useLocation as useLocationContext } from '../../context/LocationContext';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Local logo imports for fallback
import pvrLogo from '../../assets/pvr.avif';
import inoxLogo from '../../assets/inox.avif';
import cinepolisLogo from '../../assets/cinepolis.avif';

const logoMap = {
  "PVR": pvrLogo,
  "INOX": inoxLogo,
  "CINEPOLIS": cinepolisLogo,
  "Cinepolis": cinepolisLogo
};

const TheaterTimings = ({ movieId }) => {
  const { location } = useLocationContext();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const navigate = useNavigate();
  
  const formattedDate = selectedDate.format("DD-MM-YYYY");
  const next7days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));

  const { data: showsResponse, isLoading, isError } = useQuery({
    queryKey: ["shows", movieId, location, formattedDate],
    queryFn: () => getShowsByMovieAndLocation(movieId, location, formattedDate),
    placeholderData: keepPreviousData,
    enabled: !!movieId && !!location,
  });

  const showData = showsResponse?.data;

  // Group shows by theater
  const groupedTheaters = showData?.reduce((acc, show) => {
    if (!show.theater) return acc;
    const theaterId = show.theater._id;
    if (!acc[theaterId]) {
      acc[theaterId] = {
        ...show.theater,
        showSlots: []
      };
    }
    acc[theaterId].showSlots.push(show);
    return acc;
  }, {}) || {};

  const theaterList = Object.values(groupedTheaters);

  const getTheaterLogo = (theatre) => {
    const brand = theatre.name.split(' ')[0];
    return logoMap[brand] || theatre.logo || "https://placeholder.com/150";
  };

  const handleSlotClick = (slot, theatre) => {
    const movieName = slot.movie?.title 
      ? slot.movie.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
      : "movie";
    navigate(`/movies/${movieId}/${movieName}/${location}/theater/${theatre._id}/show/${slot._id}/seat-layout`);
  };

  return (
    <div className="bg-white">
      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6 px-4 py-2 border-t border-gray-100">
        {filters.map((filter, i) => (
          <button
            key={i}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-[13px] text-gray-600 hover:border-black hover:text-black transition cursor-pointer"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Legend Bar */}
      <div className="bg-[#f0f0f5] py-2 px-6 flex items-center gap-6 text-[11px] text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
          <span>Filling fast</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span>Almost full</span>
        </div>
      </div>

      {/* Date Selector Row */}
      <div className='flex items-center gap-2 my-2 overflow-x-auto py-6 px-4 border-b border-gray-100 scrollbar-hide'>
        {next7days.map((date, i) => {
          const isSelected = selectedDate.isSame(date, "day");
          
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex cursor-pointer flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[65px] transition-all border ${
                isSelected 
                  ? "bg-black text-white font-semibold border-black" 
                  : "text-black hover:bg-gray-100 border-transparent"
              }`}
            >
              <span className='text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80'>
                {date.format("ddd")}
              </span>
              <span className='text-lg font-black leading-none mb-1'>
                {date.format("D")}
              </span>
              <span className='text-[10px] uppercase font-bold tracking-tighter opacity-80'>
                {date.format("MMM")}
              </span>
            </button>
          );
        })}
      </div>

      {/* theatres & Timings Section */}
      <div className='space-y-12 px-4 py-8 max-w-7xl mx-auto'>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-gray-500">
            <p>Error loading showtimes. Please try again later.</p>
          </div>
        ) : theaterList.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic">
            <p>No shows available for the selected date and location.</p>
          </div>
        ) : (
          theaterList.map((theatre, i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-8 pb-10 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-xl transition-all duration-300">
              {/* Theatre Info Header */}
              <div className='flex items-start gap-4 min-w-[300px]'>
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center p-2 border border-gray-50 flex-shrink-0">
                  <img 
                    src={getTheaterLogo(theatre)} 
                    alt={theatre.name} 
                    className='w-full h-full object-contain' 
                  />
                </div>
                <div className="flex flex-col">
                  <p className='font-bold text-lg text-gray-900 leading-tight mb-2 hover:text-red-600 transition cursor-pointer'>
                    {theatre.name}
                  </p>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded text-[11px] text-green-700 font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Allows Cancellation
                     </div>
                     <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </button>
                  </div>
                </div>
              </div>

              {/* Timing Buttons Grid */}
              <div className='flex flex-wrap gap-4 items-center'>
                {theatre.showSlots.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((slot, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <button 
                      onClick={() => handleSlotClick(slot, theatre)}
                      className={`border border-gray-200 cursor-pointer hover:border-black hover:text-black transition-all rounded-lg px-6 py-2.5 text-center min-w-[120px] shadow-sm hover:shadow-md bg-white`}
                    >
                      <div className="flex flex-col items-center justify-center">
                         <span className="text-sm font-bold tracking-tight mb-0.5">
                           {slot.startTime}
                         </span>
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-gray-600">
                           {slot.format || "2D"} • {slot.language || "ENG"}
                         </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TheaterTimings;