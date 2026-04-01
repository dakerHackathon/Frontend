import axiosInstance from "./axiosInstance";

export const teamApi = {
  create: (userId, data) => axiosInstance.post(`/camp/${userId}/team`, data),
};
