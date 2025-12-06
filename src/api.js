import axios from "axios";

const API_BASE = "http://localhost:3000"; // change if needed
// const API_BASE = "https://urlshortnerbackend-1-0qnj.onrender.com/"; // change if needed

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
export const api = axios.create({
  baseURL: API_BASE,
});
