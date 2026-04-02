import axiosInstance from "./axiosInstance";

export const skillApi = {
  getAll: () => axiosInstance.get("/user/skills"),
};
