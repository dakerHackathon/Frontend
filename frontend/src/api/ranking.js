import axiosInstance from "./axiosInstance";

export const rankingApi = {
  getList: (filter) => axiosInstance.get("/rankings", { params: { filter } }),
  getMine: (userId) => axiosInstance.get(`/rankings/${userId}`),
  getTop3: () => axiosInstance.get("/rankings/top3"),
};
