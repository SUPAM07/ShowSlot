import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMoviesById } from "../apis";
import TheaterTimings from "../components/movie/TheaterTimings";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Clean the id if it has a leading colon
  const cleanId = id?.startsWith(":") ? id.slice(1) : id;

  const {
    data: movieData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMoviesById(id),
    placeholderData: keepPreviousData,
  });

  const movie = movieData?.data?.movie;
  console.log(movie);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black text-white px-4 text-center">
        <p className="text-xl mb-4">Failed to load movie details.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <>
      {/* MovieDetails Section */}
      <div
        className="relative text-white font-sans px-4 py-10 min-h-[450px]"
        style={{
          backgroundImage: `url(${movie.posterUrl || movie.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for darkness */}
        <div className="absolute inset-0 bg-black opacity-80"></div>

        {/* Actual Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.posterUrl || movie.img}
              alt={movie.title}
              className="rounded-xl w-52 md:w-64 shadow-2xl border border-white/10"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{movie.title}</h1>

            <div className="flex items-center gap-4 mb-5">
              <div className="bg-[#3a3a3a] px-4 py-2 rounded-md flex items-center gap-2 text-sm backdrop-blur-md bg-opacity-60">
                <span className="text-pink-500 font-bold text-lg">★ {movie.rating}</span>
                <span className="text-gray-300">/10</span>
                <span className="text-gray-400 ml-1">({movie.votes} Votes)</span>
                <button className="cursor-pointer bg-[#2f2f2f] ml-6 px-4 py-2 rounded-md hover:bg-[#4a4a4a] transition">
                  Rate now
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm mb-5">
              <span className="bg-[#3a3a3a] px-3 py-1 rounded border border-white/10">
                {movie.format?.join(", ") || "2D"}
              </span>
              <span className="bg-[#3a3a3a] px-3 py-1 rounded border border-white/10">
                {movie.languages?.join(", ") || "English"}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-6 flex items-center gap-2">
              <span className="font-medium text-white">{movie.duration}</span> 
              <span className="text-gray-600">•</span>
              <span>{movie.genre?.join(", ") || "Action"}</span>
              <span className="text-gray-600">•</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white border border-white/20">{movie.certification}</span>
              <span className="text-gray-600">•</span>
              <span>{new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </p>

            <div className="max-w-2xl text-white/90">
              <h2 className="text-xl font-bold mb-3">About the movie</h2>
              <p className="text-sm leading-relaxed mb-6 italic opacity-80">
                {movie.description}
              </p>
            </div>
            
            <div className="mt-2">
              <button 
                onClick={() => document.getElementById('timings-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-lg shadow-red-900/20"
              >
                Book tickets
              </button>
            </div>
          </div>
        </div>

        {/* Share Button (Properly positioned at top-right of container) */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            className="cursor-pointer bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white/20 transition border border-white/10"
            onClick={() => navigator.share && navigator.share({ title: movie.title, url: window.location.href })}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Timings Section */}
      <div id="timings-section" className="max-w-7xl mx-auto px-4 py-10 bg-white">
        <TheaterTimings movieId={id} />
      </div>
    </>
  );
};

export default MovieDetails;