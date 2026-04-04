import axiosInstance from "./axiosInstance";

export const teamApi = {
  getPositions: () => axiosInstance.get("/camp/positions"),
  create: (userId, data) => axiosInstance.post(`/camp/${userId}/team`, data),
  getLeaderTeams: (userId) => axiosInstance.get(`/camp/${userId}/team`),
  getDetail: (userId, teamId) => axiosInstance.get(`/camp/${userId}/team/${teamId}`),
  update: (userId, teamId, data) => axiosInstance.patch(`/camp/${userId}/team/${teamId}`, data),
  updateMember: (userId, teamId, data) =>
    axiosInstance.patch(`/camp/${userId}/team/${teamId}/member`, data),
  deleteTeam: (userId, data) => axiosInstance.delete(`/camp/${userId}/team`, { data }),
  leaveTeam: (userId, data) => axiosInstance.patch(`/camp/${userId}/team/leave`, data),
  expellMember: (userId, data) => axiosInstance.patch(`/camp/${userId}/team/expell`, data),
  invite: (userId, teamId, data) => axiosInstance.post(`/camp/${userId}/invite/${teamId}`, data),
  registerHackathon: (userId, teamId, data) =>
    axiosInstance.post(`/camp/${userId}/team/${teamId}/register`, data),
};
