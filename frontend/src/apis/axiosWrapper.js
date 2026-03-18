import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  // Using Vite's environment variable system
  baseURL: "http://localhost:9000/api", 
  withCredentials: true,
  headers: { ...defaultHeader },
});