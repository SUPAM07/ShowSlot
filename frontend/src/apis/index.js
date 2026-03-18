import { axiosWrapper } from "./axiosWrapper";

// List all the endpoints:

// Fetch the top 5 recommended movies
export const getRecommendedMovies = () => axiosWrapper.get("/movies/recommended");

// Fetch all available movies
export const getAllMovies = () => axiosWrapper.get("/movies");

// Fetch a specific movie's details
export const getMoviesById = (data) => axiosWrapper.get(`/movies/${data}`);

// Fetch shows filtered by movie, state (location), and date
export const getShowsByMovieAndLocation = (movieId, state, date) => {
  return axiosWrapper.get("/shows", {
    params: {
      movieId,
      state,
      date,
    },
  });
};

// Fetch a specific show's layout and details
export const getShowById = (data) => axiosWrapper.get(`/shows/${data}`);