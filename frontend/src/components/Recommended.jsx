import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../apis";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";

const Recommended = () => {

  const navigate = useNavigate();
  const { location } = useLocation();

const handleNavigate = (movie) => {
  const slug = movie.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with -

  navigate(`/movies/${location}/${slug}/${movie._id}/ticket`);
};

  //api call
  const {
    data: recMovies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recommended-movies"],
    queryFn: async()=> {
      return await getRecommendedMovies();
    },
    placeholderData:keepPreviousData
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
    /*
   if (isError){
    console.log("something went wrong");
   };
   console.log(recMovies);
   */

  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Recommended Movies
          </h2>
          <span onClick={()=>navigate("/movies")}
           className="text-md text-red-500 cursor-pointer hover:underline font-medium">
            See All
          </span>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recMovies?.data?.topMovies?.map((movie, i) => (
            <div key={i} onClick={()=>handleNavigate(movie)} className="rounded overflow-hidden cursor-pointer hover:scale-105 transition">
              
              {/* Poster */}
              <div className="relative">
                <img
                  src={movie.posterUrl || movie.img}
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
                  {movie.genre?.join(", ")}
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