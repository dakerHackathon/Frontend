import axiosInstance from "./axiosInstance";

export const mypageApi = {
  get: (userId) => axiosInstance.get(`/user/${userId}/mypage`),
  update: (userId, data) => axiosInstance.patch(`/user/${userId}/mypage`, data),
};
