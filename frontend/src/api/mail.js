import axiosInstance from "./axiosInstance";

export const mailApi = {
  // 1. 받은 쪽지 목록 보기 (Query: filter)
  getMessages: (userId, filter = "all") =>
    axiosInstance.get(`/user/${userId}/message`, { params: { filter } }),

  // 2. 팀 신청/초대 메시지 조회 (Query: type)
  getInvitations: (userId, type) =>
    axiosInstance.get(`/user/${userId}/invitations`, { params: { type } }),

  // 3. 쪽지 읽음 표시
  readMessage: (userId, messageId) =>
    axiosInstance.post(`/user/${userId}/message/read`, { messageId }),

  // 4 & 5. 쪽지 및 초대/신청 삭제 (공통)
  deleteMessage: (userId, messageId) =>
    axiosInstance.delete(`/user/${userId}/message/delete`, {
      data: { messageId },
    }),

  // 6. 쪽지 보내기
  sendMessage: (userId, email, title, content) =>
    axiosInstance.post(`/user/${userId}/message/send`, {
      email,
      title,
      content,
    }),

  // 7. 즐겨찾기 토글
  toggleStar: (userId, messageId) =>
    axiosInstance.post(`/user/${userId}/message/star`, { messageId }),

  //8. 팀 초대/팀 신청 수락/거절
  respondToInvitation: (userId, invitationId, accept) =>
    axiosInstance.post(`/camp/${userId}/answer`, {
      invitationId,
      accept,
    }),
};
