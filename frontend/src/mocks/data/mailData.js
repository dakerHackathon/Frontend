export const mockMessages = [
  {
    id: 1,
    sender: "김철수",
    content:
      "<strong>안녕하세요!</strong> 이번 프로젝트 관련 공지사항입니다.<br/>확인 부탁드립니다.",
    send_at: "2026-03-17 09:43",
    isRead: false,
    isStar: false,
  },
  {
    id: 2,
    sender: "이영희",
    content:
      "리액트 컴포넌트 구조 제안서 전달드립니다. <u>확인 후 피드백 주세요.</u>",
    send_at: "2026-03-16 15:43",
    isRead: true,
    isStar: true,
  },
];

export const mockInvitations = [
  {
    invitationId: 101,
    type: 1, // 1: 초대받음(Invited)
    sender: { userId: 1, userName: "Blooming 팀장" },
    position: 2,
    content:
      "저희 팀의 프론트엔드 개발자로 합류해 주시겠어요? 실력이 대단하시다고 들었습니다.",
    send_at: "2026-03-20 14:00",
  },
  {
    invitationId: 102,
    type: 2, // 2: 신청받음(Requested)
    sender: { userId: 5, userName: "박지민" },
    position: 3,
    content:
      "안녕하세요, 백엔드 개발자 박지민입니다. 팀에 기여하고 싶어 신청합니다.",
    send_at: "2026-03-19 11:20",
  },
];
