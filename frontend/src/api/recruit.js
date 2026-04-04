import axiosInstance from "./axiosInstance";

const buildRecruitParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );

export const recruitApi = {
  getPositions: () => axiosInstance.get("/camp/positions"),
  getList: (userId, params = {}) =>
    axiosInstance.get(`/camp/${userId}/recruit`, { params: buildRecruitParams(params) }),
  search: (userId, params) =>
    axiosInstance.get(`/camp/${userId}/recruit/search`, { params: buildRecruitParams(params) }),
  create: (userId, teamId, data) => axiosInstance.post(`/camp/${userId}/recruit/${teamId}`, data),
  update: (userId, articleId, data) =>
    axiosInstance.patch(`/camp/${userId}/recruit/${articleId}`, data),
  remove: (userId, articleId) => axiosInstance.delete(`/camp/${userId}/recruit`, { data: { articleId } }),
  close: (userId, articleId) =>
    axiosInstance.post(`/camp/${userId}/recruit/close`, { articleId }),
};
