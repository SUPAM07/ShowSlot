import React from "react";
import MovieCard from "../../components/movie/MovieCard";
import { languages } from "../../utils/constants";
import { useLocation } from "../../context/LocationContext";

const MovieList = ({ allMovies }) => {
  const { location } = useLocation();

  return (
    <div className="w-full md:w-3/4 p-4">
      {/* Language Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="bg-white border border-gray-200 text-[#f74362] px-3 py-1 text-sm rounded hover:bg-gray-100 cursor-pointer transition-colors"
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center bg-white px-6 py-6 rounded mb-6 shadow-sm">
        <h3 className="font-semibold text-xl">Movies in {location || "your city"}</h3>
        <a href="#" className="text-red-500 text-sm font-medium hover:underline">
          Explore Upcoming Movies →
        </a>
      </div>

      {/* Grid Rendering */}
      <div className="flex flex-wrap gap-6">
        {allMovies?.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        {(!allMovies || allMovies.length === 0) && (
          <div className="w-full py-10 text-center text-gray-500 italic">
            No movies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;