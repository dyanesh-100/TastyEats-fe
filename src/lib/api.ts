import axios from "axios";

const api = axios.create({
  baseURL: "https://tasty-eats-be.vercel.app/api",
  // http://localhost:3000/api
  // https://tasty-eats-be.vercel.app/api
});

export default api;
