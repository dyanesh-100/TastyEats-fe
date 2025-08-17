import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  // http://localhost:3000/api
  // https://tasty-eats-be.vercel.app/api
});

export default api;
