import axiosInstance from "./axiosInstance";

export const teamApi = {
  create: (userId, data) => axiosInstance.post(`/camp/${userId}/team`, data),
  detail: (userId, teamId) => axiosInstance.get(`/camp/${userId}/team/${teamId}`),
};
