import axiosInstance from "./axiosInstance";

export const userApi = {
  getTeamMembers: (userId, teamId) => axiosInstance.get(`/user/${userId}/${teamId}/member`),
  search: (keyword) => axiosInstance.get("/user/search", { params: { str: keyword } }),
};
