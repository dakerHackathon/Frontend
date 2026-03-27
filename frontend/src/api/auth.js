import axiosInstance from "./axiosInstance";

export const authApi = {
  login: (data) => axiosInstance.post("/user/login", data),
  signup: (data) => axiosInstance.post("/user/signup", data),
};
