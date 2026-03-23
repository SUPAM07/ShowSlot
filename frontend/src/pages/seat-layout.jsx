import Header from "../components/seat-layout/Header.jsx";
import Footer from "../components/seat-layout/Footer.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById, getShowsByMovieAndLocation } from "../apis/index";
import screenImg from "../assets/screen.png"; 
import { useSeatContext } from "../context/SeatContext";
import { useLocation } from "../context/LocationContext";
import { socket } from "../utils/socket";
import React, { useEffect, useState, Fragment } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const Seat = ({ seat, row, selectedSeats, lockedSeats , onClick }) => {
  const seatId = `${row}${seat.number}`;
  const isLocked = lockedSeats?.includes(seatId);
  const isSelected = selectedSeats.includes(seatId);

  return (
    <button
      className={`w-7 h-7 sm:w-8 sm:h-8 m-[2px] rounded border text-[13px] font-medium transition-colors
        ${
          seat.status === "occupied"
            ? "bg-[#f5f5f5] border-transparent text-gray-400 cursor-not-allowed"
            : isLocked
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-[#1ea83c] text-white border-[#1ea83c] cursor-pointer"
            : "bg-white border-gray-400 text-gray-800 hover:bg-[#1ea83c] hover:text-white hover:border-[#1ea83c] cursor-pointer"
        }`}
      disabled={seat.status === "occupied" || isLocked}
      onClick={onClick}
    >
      {seat.status === "occupied" || isLocked ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {

  const navigate = useNavigate();
  const [lockedSeats, setLockedSeats] = useState([]);
  const { selectedSeats, setSelectedSeats, setShows } = useSeatContext();
  const { location } = useLocation();
  const { showId } = useParams();

  const handleSelectSeat = (row, number) => {
    const seatId = `${row}${number}`;
    setSelectedSeats((prev) => 
      prev.includes(seatId) ? prev.filter((existingId) => existingId !== seatId) : [...prev, seatId]
    );
  }

  const { data: showData, isLoading, isError } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    placeholderData: keepPreviousData,
    enabled: !!showId,
    select: (res) => res.data,
  });

  useEffect(() => {
    if (showData) {
      setShows(showData);
    }
  }, [showData, setShows]);

  const movieId = showData?.movie?._id;
  const theaterId = showData?.theater?._id;
  const date = showData?.date;

  const { data: allShowsResponse } = useQuery({
    queryKey: ["shows", movieId, location, date],
    queryFn: () => getShowsByMovieAndLocation(movieId, location, date),
    enabled: !!movieId && !!location && !!date,
  });
  
  const allShows = allShowsResponse?.data
    ?.filter(s => s.theater._id === theaterId)
    ?.sort((a,b) => a.startTime.localeCompare(b.startTime)) || [];

  const isSelectedSeats = selectedSeats.length > 0;

  /* Socket.io Code start  */
  useEffect(() => {
    setSelectedSeats([]);
    socket.emit("join-show", {showId});

    const handleLockedSeatsInitials = ({seatIds}) => {
      setLockedSeats(seatIds);
    };

    const handleSeatLocked = ({seatIds, showId: incommingShowId}) => {
      if(incommingShowId !== showId) return;
      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    };

    const handleSeatUnlocked = ({seatIds, showId: incommingShowId}) => {
      if(incommingShowId !== showId) return;
      setLockedSeats((prev) => prev.filter((id) => !seatIds.includes(id)));
    };

    const handleSeatLockedFailed = ({alreadyLocked}) => {
      toast.error(`Some seats are already locked: ${alreadyLocked.join(", ")}`);
    };

    socket.on("locked-seats-initials", handleLockedSeatsInitials);
    socket.on("seat-locked", handleSeatLocked);
    socket.on("seat-unlocked", handleSeatUnlocked);
    socket.on("seat-locked-failed", handleSeatLockedFailed);

    return () => {
      socket.off("locked-seats-initials", handleLockedSeatsInitials);
      socket.off("seat-locked", handleSeatLocked);
      socket.off("seat-unlocked", handleSeatUnlocked);
      socket.off("seat-locked-failed", handleSeatLockedFailed);
    };
  }, [showId, setSelectedSeats])
  /* Socket.io Code ends */

  const handleSlotNav = (slot) => {
    if (slot._id === showId) return;
    const movieName = slot.movie?.title 
      ? slot.movie.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") 
      : "movie";
    navigate(`/movies/${movieId}/${movieName}/${location}/theater/${theaterId}/show/${slot._id}/seat-layout`);
  };

  const parsedDate = date ? dayjs(date, "DD-MM-YYYY") : null;

  return (
    <>
      <div className="h-screen overflow-y-hidden bg-[#f8f9fa]">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-10">
          <Header showData={showData} />
          
          {/* Time Slots Section matching Mockup */}
          {parsedDate && allShows.length > 0 && (
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 overflow-x-auto scrollbar-hide shadow-sm">
              <div className="flex flex-col items-center justify-center min-w-[50px]">
                <span className="text-[11px] text-gray-500 font-medium uppercase tracking-widest">{parsedDate.format('ddd')}</span>
                <span className="text-[13px] font-bold text-gray-800">{parsedDate.format('DD MMM')}</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-200"></div>
              <div className="flex gap-3">
                {allShows.map(slot => {
                  const isActive = slot._id === showId;
                  return (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotNav(slot)}
                      className={`flex flex-col items-center justify-center px-6 py-1.5 rounded-[4px] border border-gray-300 transition-colors w-[110px]
                        ${isActive ? "bg-white text-[#1ea83c] border-[#1ea83c] pointer-events-none" : "bg-white text-gray-800 hover:text-[#1ea83c]"}`}
                    >
                      <span className="text-[13px] font-bold">{slot.startTime}</span>
                      <span className="text-[9px] uppercase font-bold text-gray-400 mt-0.5 tracking-widest">{slot.audioType || "DOLBY 7.1"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Seat Layout */}
         <div className="max-w-7xl mx-auto mt-[160px] md:mt-[140px] px-6 pb-24 bg-white h-[calc(100vh-220px)] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col items-center justify-center pt-8">
            {showData?.seatLayout && (
              <div className="flex flex-col items-center justify-center">
                {Object.entries(
                  showData.seatLayout.reduce((acc, curr) => {
                    if (!acc[curr.type])
                      acc[curr.type] = { price: curr.price, rows: [] };
                    acc[curr.type].rows.push(curr);
                    return acc;
                  }, {})
                ).map(([type, { price, rows }]) => (
                  <div
                    key={type}
                    className="mb-10 w-full flex flex-col items-center justify-center"
                  >
                    <h2 className="text-center font-bold text-[13px] text-gray-800 uppercase tracking-widest mb-4">
                      {type} : ₹{price}
                    </h2>
                    <div className="space-y-1.5">
                      {rows.map((rowObj) => (
                        <div key={rowObj.row} className="flex items-center">
                          <div className="w-5 text-right mr-3 text-xs font-semibold text-gray-400">
                            {rowObj.row}
                          </div>
                          <div className="flex gap-[2px]">
                            {rowObj.seats.map((seat, i) => (
                              <React.Fragment key={i}>
                                {i !== 0 && (seat.number - rowObj.seats[i-1].number > 1) && (
                                  <div className="w-8" /> // Space for missing seat numbers representing aisles
                                )}
                                <Seat
                                  seat={seat}
                                  row={rowObj.row}
                                  selectedSeats={selectedSeats}
                                  lockedSeats={lockedSeats}
                                  onClick={() => handleSelectSeat(rowObj.row, seat.number)}
                                />
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-12 mb-10 w-full">
              <img
                src={screenImg}
                alt="Screen"
                className="w-full max-w-[400px] object-contain opacity-70 drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <Footer isSelected={isSelectedSeats} selectedSeats={selectedSeats} showData={showData} state={location} />
        </div>
      </div>
    </>
  );
};

export default SeatLayout;
