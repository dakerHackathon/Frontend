import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://13.125.160.175:8080",
  timeout: 3000, // 3초 제한
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  // 응답 실패 시
  (error) => {
    const code = error.code;
    const status = error.response?.status;

    // 타임아웃(ECONNABORTED) 또는 서버의 408 Request Timeout 처리
    if (code === "ECONNABORTED" || status === 408) {
      alert("서버 응답 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;