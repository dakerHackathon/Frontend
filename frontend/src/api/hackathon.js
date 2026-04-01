import axiosInstance from "./axiosInstance";

export const hackathonApi = {
  getList: () => axiosInstance.get("/hackathons"),
};
