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

// ========== AUTH APIs ==========

// Send OTP to email
export const registerUser = (email) =>
  axiosWrapper.post("/users/send-otp", { email });

// Verify OTP and login
export const loginUser = (email, otp) =>
  axiosWrapper.post("/users/verify-otp", { email, otp });

// Refresh access token
export const refreshToken = () =>
  axiosWrapper.post("/users/refresh-token");

// Logout
export const logoutUser = () =>
  axiosWrapper.post("/users/logout");

// Get user profile
export const getUserProfile = () =>
  axiosWrapper.get("/users/profile");

// Update user profile
export const updateUserProfile = (data) =>
  axiosWrapper.put("/users/profile", data);

// ========== BOOKING APIs ==========

// Create a booking
export const createBooking = (showId, seats, paymentMethod) =>
  axiosWrapper.post("/bookings", { showId, seats, paymentMethod });

// Get my bookings
export const getMyBookings = () =>
  axiosWrapper.get("/bookings/my-bookings");

// Cancel a booking
export const cancelBooking = (bookingId) =>
  axiosWrapper.delete(`/bookings/${bookingId}`);