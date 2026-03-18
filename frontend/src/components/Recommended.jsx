import React from "react";
import { movies } from "../utils/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../apis";
const Recommended = () => {
  const {
    data: recMovies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recommended-movies"],
    queryFn: getRecommendedMovies,
  });

  // 🔄 Loading state
  if (isLoading) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-lg font-medium">Loading movies...</p>
      </div>
    );
  }

  // ❌ Error state
  if (isError) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-red-500 font-medium">
          Failed to load recommended movies
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Recommended Movies
          </h2>
          <span className="text-md text-red-500 cursor-pointer hover:underline font-medium">
            See All
          </span>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recMovies?.map((movie, i) => (
            <div key={i} className="rounded overflow-hidden cursor-pointer hover:scale-105 transition">
              
              {/* Poster */}
              <div className="relative">
                <img
                  src={movie.poster || movie.img}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded"
                />
              </div>

              {/* Rating */}
              <div className="bg-black text-white text-sm px-2 py-1 flex justify-between">
                <span>⭐ {movie.rating || "N/A"}/10</span>
                <span>{movie.votes || 0} Votes</span>
              </div>

              {/* Info */}
              <div className="px-2 py-1">
                <h3 className="font-semibold text-lg">
                  {movie.title}
                </h3>
                <p className="text-md text-gray-500">
                  {movie.genres?.join(", ") || "Drama"}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Recommended;