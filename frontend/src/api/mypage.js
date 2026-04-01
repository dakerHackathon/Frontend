import axiosInstance from "./axiosInstance";

export const mypageApi = {
  get: (userId) => axiosInstance.get(`/user/${userId}/mypage`),
};
