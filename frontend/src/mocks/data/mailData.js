export const mockMessages = [
  {
    id: 10,
    sender: "운영사무국",
    title: "[공지] 해커톤 본선 장소 및 주차 등록 안내",
    content:
      "안녕하세요. 본선은 <strong>서울 코엑스 B홀</strong>에서 진행됩니다. 차량 이용 시 사전 등록이 필요하니 확인 부탁드립니다.",
    send_at: "2026-03-31 09:00",
    isRead: false,
    isStar: true,
  },
  {
    id: 11,
    sender: "김현수",
    title: "지난번 공유해준 디자이너 인터페이스 관련",
    content:
      "보내주신 UI 가이드가 프로젝트 방향성과 잘 맞아서 팀원들과 공유했습니다. 정돈된 작업 톤이 특히 좋았습니다.",
    send_at: "2026-03-30 18:20",
    isRead: true,
    isStar: false,
  },
  {
    id: 12,
    sender: "운영팀",
    title: "API 명세서 수정 요청 (프로필 업데이트)",
    content:
      "사용자 프로필 업데이트 부분에서 <u>birth_date</u> 필드가 누락된 것 같습니다. 확인 후 수정 가능할까요?",
    send_at: "2026-03-30 14:10",
    isRead: true,
    isStar: true,
  },
  {
    id: 13,
    sender: "박지민",
    title: "오늘 회의 시간 변경 가능할까요?",
    content:
      "갑작스러운 일정 문제로 기존 4시 회의를 <strong>5시</strong>로 미룰 수 있을지 문의드립니다. 팀원분들 확인 부탁드려요.",
    send_at: "2026-03-29 11:30",
    isRead: false,
    isStar: false,
  },
  {
    id: 14,
    sender: "시스템",
    title: "비밀번호 변경 권장 안내",
    content:
      "회원님의 계정 보안을 위해 비밀번호를 변경한 지 90일이 경과했습니다. <u>보안 설정</u>에서 변경해 주세요.",
    send_at: "2026-03-28 10:00",
    isRead: true,
    isStar: false,
  },
];

export const mockInvitations = [
  {
    invitationId: 201,
    content:
      "저희 팀은 현재 AI 기반 서비스를 기획 중입니다. 귀하의 <strong>백엔드</strong> 역량이 저희 프로젝트에 꼭 필요합니다.",
    type: 1, // 팀에 초대를 받음
    sender: {
      userId: 45,
      userName: "박민준",
      teamName: "코드마스터", // 초대를 받은 경우 팀명 존재
    },
    position: 3, // 백엔드
    created_at: "2026-03-31 11:05",
  },
  {
    invitationId: 202,
    content:
      "안녕하세요! 해커톤 우승 경험이 있는 <u>서비스 기획자</u> 최서연입니다. 열정 넘치는 팀에 합류하여 시너지를 내고 싶습니다.",
    type: 2, // 팀 참가 신청을 받음
    sender: {
      userId: 72,
      userName: "최서연",
      teamName: null, // 참가 요청인 경우 null
    },
    position: 1, // 기획자
    created_at: "2026-03-31 10:40",
  },
  {
    invitationId: 203,
    content:
      "포트폴리오가 매우 인상 깊었습니다. 저희 팀의 <strong>UI/UX 디자인</strong>을 전담해주실 분을 찾고 있습니다.",
    type: 1, // 팀에 초대를 받음
    sender: {
      userId: 33,
      userName: "이지후",
      teamName: "디자인랩",
    },
    position: 4, // 디자이너
    created_at: "2026-03-30 16:15",
  },
  {
    invitationId: 204,
    content:
      "성능 최적화에 관심이 많은 프론트엔드 개발자입니다. 효율적인 컴포넌트 구조로 프로젝트를 완성하고 싶습니다.",
    type: 2, // 팀 참가 신청을 받음
    sender: {
      userId: 88,
      userName: "강다니엘",
      teamName: null,
    },
    position: 2, // 프론트엔드
    created_at: "2026-03-30 09:20",
  },
  {
    invitationId: 205,
    content:
      "비즈니스 모델 구축에 강점이 있는 <u>기획자</u>분을 모시고 싶습니다. 현재 개발 인력은 세팅이 완료되었습니다.",
    type: 1, // 팀에 초대를 받음
    sender: {
      userId: 15,
      userName: "한유진",
      teamName: "대상가즈아",
    },
    position: 1, // 기획자
    created_at: "2026-03-29 13:50",
  },
];
