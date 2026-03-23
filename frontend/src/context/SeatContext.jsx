import React, { createContext, useContext, useState } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [shows, setShows] = useState(null);

  return (
    <SeatContext.Provider value={{ selectedSeats, setSelectedSeats, shows, setShows }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeatContext = () => {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeatContext must be used within a SeatProvider");
  }
  return context;
};
