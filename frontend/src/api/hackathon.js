import axiosInstance from "./axiosInstance";

export const hackathonApi = {
  getList: () =>
    axiosInstance.get(
      typeof window === "undefined"
        ? "/hackathons"
        : new URL("/hackathons", window.location.origin).toString(),
    ),
};
