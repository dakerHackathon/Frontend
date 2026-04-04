import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5173",
  //실제 서버 주소 : 13.125.160.175:8080
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default axiosInstance;
