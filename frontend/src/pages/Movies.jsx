import React from "react";
import BannerSlider from "../components/shared/BannerSlider";
import MovieFilters from "../components/movie/MovieFilters";
import MovieList from "../components/movie/MovieList";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllMovies } from "../apis";
import toast from "react-hot-toast";

const Movies = () => {
  const { data: allMovies, isError, isLoading } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => {
      return await getAllMovies();
    },
    placeholderData: keepPreviousData,
    select: (res) => res.data.movies
  });

  if (isError) {
    toast.error("Something went wrong!");
  }

  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
        <MovieFilters />
        {isLoading ? (
          <div className="w-full md:w-3/4 flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <MovieList allMovies={allMovies} />
        )}
      </div>
    </div>
  );
};

export default Movies;