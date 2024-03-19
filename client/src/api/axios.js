import axios from "axios";

export default axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api/v1/"
      : "https://spotify-tl14.onrender.com/api/v1/",
  withCredentials: true,
});
