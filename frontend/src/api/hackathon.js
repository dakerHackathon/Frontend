import axiosInstance from "./axiosInstance";

export const hackathonApi = {
  getList: (userId) => axiosInstance.get(`/hackathons/${userId}`),
  getDetail: (userId, hackathonId) => axiosInstance.get(`/hackathons/${userId}/${hackathonId}`),
  toggleSave: (userId, hackathonId) =>
    axiosInstance.post(`/hackathons/${userId}/save`, { hackathonId }),
  uploadSubmission: (userId, hackathonId, data) =>
    axiosInstance.post(`/hackathons/${userId}/${hackathonId}/upload`, data),
};
