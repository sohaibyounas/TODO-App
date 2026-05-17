import axios from "axios";

export const api = axios.create({
  // baseURL: "https://api.escuelajs.co/api/v1",
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
