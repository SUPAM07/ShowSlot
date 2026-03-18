import React from "react";
import BannerSlider from "../components/shared/BannerSlider";
import MovieFilters from "../components/movie/MovieFilters";
import MovieList from "../components/movie/MovieList";
import MovieCard from "../components/movie/MovieCard";

const Movies = () => {
  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
        <MovieFilters />
         <MovieList />
         <MovieCard />
        
      </div>
    </div>
  );
};

export default Movies;