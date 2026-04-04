export const initialProfile = {
  name: "강석진",
  email: "asdf123@gmail.com",
  intro:
    "안녕하세요. 3년차 개발자입니다. React와 Node.js를 중심으로 서비스를 만들고 있습니다.",
  github: "https://github.com/seokjin-dev",
  portfolio: "https://seokjin.dev",
  skills: ["React", "TypeScript", "Node.js", "Spring"],
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop",
};

export const skillPool = [
  "React",
  "TypeScript",
  "Node.js",
  "Spring",
  "Next.js",
  "NestJS",
  "Java",
  "Python",
  "MySQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kotlin",
];

export const initialHackathons = [
  {
    id: "h1",
    title: "2024 AI 아이디어톤",
    status: "종료",
    date: "2024.03.16 - 03.30",
    members: [
      { id: "m1", name: "김현호" },
      { id: "m2", name: "이승제" },
    ],
  },
  {
    id: "h2",
    title: "Spring Global Hack",
    status: "진행중",
    date: "2026.03.20 - 04.02",
    members: [
      { id: "m3", name: "김유진" },
      { id: "m4", name: "최민석" },
    ],
  },
  {
    id: "h3",
    title: "FinTech Innovation 2023",
    status: "종료",
    date: "2023.11.05 - 11.20",
    members: [
      { id: "m5", name: "박도윤" },
      { id: "m6", name: "정하은" },
    ],
  },
];

export const teamPartOptions = [
  { value: "planner", label: "PM", shortLabel: "PM" },
  { value: "frontend", label: "프론트", shortLabel: "FE" },
  { value: "backend", label: "백엔드", shortLabel: "BE" },
];

const normalizeTeamPartValue = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const teamPartValueAliasMap = {
  planner: ["planner", "pm", "productmanager", "product_manager"],
  frontend: ["frontend", "front", "fe"],
  backend: ["backend", "back", "be"],
};

export const buildTeamPartOptions = (positions = []) =>
  positions.reduce((acc, position) => {
    const normalizedName = normalizeTeamPartValue(position.name);
    const matchedOption = teamPartOptions.find((option) =>
      (teamPartValueAliasMap[option.value] ?? [option.value]).some(
        (alias) => normalizeTeamPartValue(alias) === normalizedName,
      ),
    );

    if (!matchedOption) {
      return acc;
    }

    acc.push({
      ...matchedOption,
      label: position.name || matchedOption.label,
    });

    return acc;
  }, []);

export const teamRoleOptions = ["팀장", "팀원"];

export const teams = [
  {
    id: "t1",
    name: "Team Blooming",
    role: "팀장",
    leaderId: "tm1",
    description:
      "해커톤용 작업 플로우를 만들어 보는 팀입니다. 빠르게 실행하고 피드백을 반복하는 것을 중요하게 생각합니다.",
    linkedHackathonId: "h2",
    members: [
      {
        id: "tm1",
        name: "강석진",
        nickname: "석진",
        email: "asdf123@gmail.com",
        role: "팀장",
        part: "frontend",
      },
      {
        id: "tm2",
        name: "김현호",
        nickname: "현호",
        email: "hyeonho@mail.com",
        role: "팀원",
        part: "backend",
      },
      {
        id: "tm3",
        name: "이승제",
        nickname: "승제",
        email: "seungje@mail.com",
        role: "팀원",
        part: "designer",
      },
    ],
  },
  {
    id: "t2",
    name: "AI Avengers",
    role: "팀장",
    leaderId: "tm5",
    description:
      "LLM 기반 추천 서비스를 준비 중인 팀입니다. 데이터 실험과 제품 감각을 함께 챙기는 것이 목표입니다.",
    linkedHackathonId: null,
    members: [
      {
        id: "tm4",
        name: "강석진",
        nickname: "석진",
        email: "asdf123@gmail.com",
        role: "팀원",
        part: "frontend",
      },
      {
        id: "tm5",
        name: "김유진",
        nickname: "유진",
        email: "yujin@mail.com",
        role: "팀장",
        part: "ai",
      },
      {
        id: "tm6",
        name: "최민석",
        nickname: "민석",
        email: "minseok@mail.com",
        role: "팀원",
        part: "backend",
      },
    ],
  },
];

export const inviteCandidatePool = [
  {
    id: "u1",
    name: "한지훈",
    nickname: "지훈",
    email: "jihoon@mail.com",
    parts: ["frontend", "ai"],
    intro: "React와 TypeScript 기반 서비스 개발 경험이 있습니다.",
  },
  {
    id: "u2",
    name: "다은 정",
    nickname: "다은",
    email: "daeun@mail.com",
    parts: ["planner"],
    intro: "기획 문서와 사용자 인터뷰 정리에 강점이 있습니다.",
  },
  {
    id: "u3",
    name: "서윤 김",
    nickname: "서윤",
    email: "seoyoon@mail.com",
    parts: ["designer"],
    intro: "프로덕트 디자인과 프로토타입 제작을 맡고 있습니다.",
  },
  {
    id: "u4",
    name: "박도윤",
    nickname: "도윤",
    email: "doyoon@mail.com",
    parts: ["backend", "ai"],
    intro: "Spring과 Python으로 API와 모델 서빙을 다뤄봤습니다.",
  },
];

export const savedHackathons = [
  { id: "s1", title: "Global Tech Meetup 2024", org: "브릿지" },
  { id: "s2", title: "Campus Hack Challenge", org: "대학생연합" },
  { id: "s3", title: "Bio Health Datathon", org: "서울산업진흥원" },
  { id: "s4", title: "Green Energy Sprint", org: "에너지랩" },
];

export const inboxSummary = [
  "해커톤 공지 메일 3개",
  "팀 제안 메시지 2개",
  "읽지 않은 쪽지 5개",
];

export const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.05)]";
