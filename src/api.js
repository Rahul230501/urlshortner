import axios from "axios";

const API_BASE = "http://localhost:3000"; // change if needed

export const api = axios.create({
  baseURL: API_BASE,
});
