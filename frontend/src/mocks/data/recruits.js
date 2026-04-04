export const RECRUIT_STORAGE_KEY = "mockRecruitArticles";

export const mockRecruitPositions = [
  { id: 1, name: "FrontEnd" },
  { id: 2, name: "BackEnd" },
  { id: 3, name: "AI" },
  { id: 4, name: "DB" },
  { id: 5, name: "Designer" },
];

export const mockRecruitTeams = [
  {
    id: 1,
    name: "#336DFE",
    positions: [1, 2],
    hackathon: {
      hackathonId: 2,
      hackathonTitle: "AI 아이디어톤 2026",
    },
  },
  {
    id: 2,
    name: "#BloomUp",
    positions: [1, 3, 5],
    hackathon: {
      hackathonId: 3,
      hackathonTitle: "캠퍼스 창업톤 2026",
    },
  },
  {
    id: 3,
    name: "#Nebula",
    positions: [2, 4],
    hackathon: {
      hackathonId: 4,
      hackathonTitle: "부산 빅데이터톤 2026",
    },
  },
];

export const initialRecruitArticles = [
  {
    article: {
      id: 1,
      title: "팀원 모집합니다.",
      content:
        "아이디어를 빠르게 프로토타입으로 만들고 실제 사용자 검증까지 함께할 분을 찾고 있습니다.",
      positions: [
        { position: 1, headCount: 1 },
        { position: 2, headCount: 1 },
        { position: 3, headCount: 1 },
      ],
      isOpen: true,
      writer: 1,
      createdAt: "2026-04-04 11:55",
      contact: "https://open.kakao.com/o/recruit-1",
    },
    team: mockRecruitTeams[0],
  },
  {
    article: {
      id: 2,
      title: "마지막 FE, DB 팀원 구합니다.",
      content: "프론트엔드와 데이터 처리 경험이 있는 분이면 바로 합류 가능합니다.",
      positions: [
        { position: 1, headCount: 1 },
        { position: 4, headCount: 1 },
      ],
      isOpen: true,
      writer: 2,
      createdAt: "2026-04-04 11:41",
      contact: "https://open.kakao.com/o/recruit-2",
    },
    team: mockRecruitTeams[2],
  },
  {
    article: {
      id: 3,
      title: "백엔드, AI 가능하신 분 모집합니다.",
      content: "모델 서빙과 API 설계 경험이 있는 분을 우선으로 찾고 있습니다.",
      positions: [
        { position: 2, headCount: 1 },
        { position: 3, headCount: 2 },
      ],
      isOpen: true,
      writer: 1,
      createdAt: "2026-04-04 11:28",
      contact: "https://open.kakao.com/o/recruit-3",
    },
    team: mockRecruitTeams[1],
  },
  {
    article: {
      id: 4,
      title: "디자이너와 개발자 모두 모집해요.",
      content: "브랜딩과 UI 컨셉까지 같이 만들고 갈 분을 기다립니다.",
      positions: [
        { position: 1, headCount: 1 },
        { position: 5, headCount: 1 },
      ],
      isOpen: false,
      writer: 3,
      createdAt: "2026-04-03 21:10",
      contact: "https://open.kakao.com/o/recruit-4",
    },
    team: mockRecruitTeams[1],
  },
];

export const getStoredRecruitArticles = () => {
  const storedArticles = localStorage.getItem(RECRUIT_STORAGE_KEY);

  if (!storedArticles) {
    localStorage.setItem(RECRUIT_STORAGE_KEY, JSON.stringify(initialRecruitArticles));
    return initialRecruitArticles;
  }

  return JSON.parse(storedArticles);
};

export const saveStoredRecruitArticles = (articles) => {
  localStorage.setItem(RECRUIT_STORAGE_KEY, JSON.stringify(articles));
};
