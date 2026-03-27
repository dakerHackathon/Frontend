export const initialProfile = {
  name: "강석진",
  email: "asdf123@gmail.com",
  intro: "안녕하세요! 3년차 풀스택 개발자입니다. React와 Node.js를 주력으로 사용합니다.",
  github: "https://github.com/seokjin-dev",
  portfolio: "https://seokjin.dev",
  skills: ["React", "TypeScript", "Node.js", "Spring"],
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop",
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
    status: "완료",
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
    status: "완료",
    date: "2023.11.05 - 11.20",
    members: [
      { id: "m5", name: "박준영" },
      { id: "m6", name: "송하늘" },
    ],
  },
];

export const teams = [
  {
    id: "t1",
    name: "Team Blooming",
    role: "팀장",
    description: "해커톤 플랫폼 고도화",
    members: [
      { id: "tm1", name: "강석진", email: "asdf123@gmail.com" },
      { id: "tm2", name: "김현호", email: "hyeonho@mail.com" },
      { id: "tm3", name: "이승제", email: "seungje@mail.com" },
    ],
  },
  {
    id: "t2",
    name: "AI Avengers",
    role: "팀원",
    description: "LLM 기반 추천 서비스",
    members: [
      { id: "tm4", name: "강석진", email: "asdf123@gmail.com" },
      { id: "tm5", name: "김유진", email: "yujin@mail.com" },
      { id: "tm6", name: "최민석", email: "minseok@mail.com" },
    ],
  },
];

export const savedHackathons = [
  { id: "s1", title: "Global Tech Meetup 2024", org: "블루밍" },
  { id: "s2", title: "Campus Hack Challenge", org: "대학 연합" },
  { id: "s3", title: "Bio Health Datathon", org: "헬스케어랩" },
  { id: "s4", title: "Green Energy Sprint", org: "에너지넷" },
];

export const inboxSummary = [
  "해커톤 공지 메일 3개",
  "팀 제안 메시지 2개",
  "읽지 않은 쪽지 5개",
];

export const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.05)]";