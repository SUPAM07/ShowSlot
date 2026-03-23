import React from "react";
import { allMovies as localMovies } from "../../utils/constants";
import metro from "../../assets/metro.avif";
import dragon from "../../assets/dragon.avif";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { location } = useLocation();

  if (!movie) return null;

  // Find local fallback image
  const localMovie = localMovies.find(m => m.title.toLowerCase() === movie.title.toLowerCase());
  
  // Custom mapping for movies not in the constants array but in assets
  const customMap = {
    "Metro In Dino": metro,
    "How to Train Your Dragon: Return of Night Fury": dragon
  };

  const poster = movie?.posterUrl || localMovie?.img || customMap[movie.title] || movie?.img;

  const handleNavigate = () => {
    const slug = movie.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-"); // replace spaces with -

    navigate(`/movies/${location || 'default'}/${slug}/${movie._id}/ticket`);
  };

  return (
    <div className="w-40 md:w-52 cursor-pointer group" onClick={handleNavigate}>
      <div className="relative overflow-hidden rounded-lg shadow-md mb-2">
        <img
          src={poster}
          alt={movie?.title}
          className="w-full h-[300px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-white text-[10px] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{movie?.certification || "UA"}</span>
          <span>{movie?.rating}/10</span>
        </div>
      </div>
      <p className="font-bold text-gray-800 text-sm truncate">{movie?.title}</p>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
        <span className="text-pink-500 font-bold">★ {movie?.rating}</span>
        <span>•</span>
        <span>{movie?.votes} Votes</span>
      </div>
      <p className="text-[11px] text-gray-400 mt-1 truncate">
        {Array.isArray(movie?.languages) ? movie.languages.join(", ") : movie?.languages}
      </p>
    </div>
  );
};

export default MovieCard;