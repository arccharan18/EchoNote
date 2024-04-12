import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/v1/"
    : "https://api.spotify.com/v1/endpoint";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = 'BQBYm3rbHNdPZlToUgGLTA-ruhgML4L5GeuMNj2w4NTYHl7proaD86NKGzLcNGjRKyuoamF4_t2gABI9IeyJv8r5yjrV4xamKCDavcXEFhSZHb2Yj9RnJG5mUjgKDDCy35Ig5m8t2WjnecuM-D8CnuDDQASgP8FPBSMqhej5ZJicIEVNpc0FfqqRNyt7K-O_lMylYvv6hcPmuQiWB5ht7JMo1vEZoikCDyEZM4-EDL4AZqGJjm24qZlgqnXDrHxkCQpdkNrLsXAnYsPW9-wijxrA';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
