import axiosInstance from "./axiosInstance";

export const temperatureApi = {
  getMembers: (userId, hackathonId) => axiosInstance.get(`/user/${userId}/temperature/${hackathonId}`),
  vote: (userId, hackathonId, data) => axiosInstance.post(`/user/${userId}/temperature/${hackathonId}`, data),
};
