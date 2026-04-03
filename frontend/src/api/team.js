import axiosInstance from "./axiosInstance";

export const teamApi = {
  create: (userId, data) => axiosInstance.post(`/camp/${userId}/team`, data),
  getLeaderTeams: (userId) => axiosInstance.get(`/camp/${userId}/team`),
  registerHackathon: (userId, teamId, data) =>
    axiosInstance.post(`/camp/${userId}/team/${teamId}/register`, data),
};
