import axiosInstance from "./axiosInstance";

export const hackathonApi = {
  getList: () => axiosInstance.get("/hackathons"),
  getDetail: (hackathonId) => axiosInstance.get(`/hackathons/${hackathonId}`),
  toggleSave: (userId, hackathonId) =>
    axiosInstance.post(`/hackathons/${userId}/save`, { hackathonId }),
};
