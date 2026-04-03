import { useState, useCallback } from "react";
import { mailApi } from "../api/mail";
import { useApi } from "./common/useApi"; // 가져오신 훅 사용

export const useMail = (userId) => {
  const [messages, setMessages] = useState([]);
  const [invitations, setInvitations] = useState([]);

  // --- useApi 재활용 구간 ---
  const getMessagesApi = useApi(mailApi.getMessages);
  const getInvitationsApi = useApi(mailApi.getInvitations);
  const readApi = useApi(mailApi.readMessage);
  const deleteApi = useApi(mailApi.deleteMessage);
  const sendApi = useApi(mailApi.sendMessage);
  const starApi = useApi(mailApi.toggleStar);
  const responseInvitationApi = useApi(mailApi.respondToInvitation);

  // 1. 메시지 목록 가져오기
  const fetchMessages = useCallback(
    async (filter) => {
      try {
        const res = await getMessagesApi.execute(userId, filter);
        if (res.isSuccess) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("메시지 로딩 에러:", err);
      }
    },
    [userId, getMessagesApi],
  );

  // 2. 초대 목록 가져오기
  const fetchInvitations = useCallback(
    async (type) => {
      try {
        const res = await getInvitationsApi.execute(userId, type);
        if (res.isSuccess) {
          setInvitations(res.data.invitations);
        }
      } catch (err) {
        console.error("초대 목록 로딩 에러:", err);
      }
    },
    [userId, getInvitationsApi],
  );

  // 3. 읽음 처리
  const markAsRead = async (messageId) => {
    try {
      const res = await readApi.execute(userId, messageId);
      if (res.isSuccess) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 4. 삭제
  const removeMessage = async (messageId) => {
    try {
      const res = await deleteApi.execute(userId, messageId);
      if (res.isSuccess) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        setInvitations((prev) =>
          prev.filter((i) => i.invitationId !== messageId),
        );
      }
      return res.isSuccess;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // 5. 즐겨찾기 토글
  const toggleStar = async (messageId) => {
    try {
      const res = await starApi.execute(userId, messageId);
      if (res.isSuccess) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, isStar: !m.isStar } : m,
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 6. 전송
  const sendMail = async (email, title, content) => {
    try {
      const res = await sendApi.execute(userId, email, title, content);
      return res.isSuccess;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const respondToInvitation = async (invitationId, accept) => {
    try {
      console.log("1. API 호출 직전 - Params:", {
        userId,
        invitationId,
        accept,
      });
      const res = await responseInvitationApi.execute(
        userId,
        invitationId,
        accept,
      );
      console.log("2. API 호출 직후 - res값:", res); // 여기서 undefined가 찍힌다면?

      if (res?.isSuccess) {
        setInvitations((prev) =>
          prev.filter((i) => i.invitationId !== invitationId),
        );
      }
      return res;
    } catch (err) {
      console.error("3. Catch 블록 에러:", err);
      return { isSuccess: false, message: "에러 발생" };
    }
  };

  return {
    messages,
    invitations,
    isLoading:
      getMessagesApi.isLoading ||
      getInvitationsApi.isLoading ||
      sendApi.isLoading ||
      responseInvitationApi.isLoading,
    error: getMessagesApi.error || sendApi.error,
    fetchMessages,
    fetchInvitations,
    markAsRead,
    removeMessage,
    toggleStar,
    sendMail,
    respondToInvitation,
  };

  //팀 초대
};
