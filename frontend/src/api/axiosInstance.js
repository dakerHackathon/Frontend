import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://13.125.160.175:8080",
  // 로컬 MSW 확인이 필요할 때만 localhost:5173으로 되돌려서 사용합니다.
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
