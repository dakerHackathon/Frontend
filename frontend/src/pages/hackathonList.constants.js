export const sidebarRankings = [
  {
    title: "블루밍 온도",
    entries: [
      { rank: 1, name: "강석진", value: "43.5" },
      { rank: 2, name: "김현호", value: "41.3" },
      { rank: 3, name: "김민준", value: "39.8" },
    ],
    currentUser: { name: "My NickName·18th", value: "36.5" },
  },
  {
    title: "최다 우승",
    entries: [
      { rank: 1, name: "강석진", value: "8회" },
      { rank: 2, name: "김현호", value: "7회" },
      { rank: 3, name: "김민준", value: "6회" },
    ],
    currentUser: { name: "My NickName·18th", value: "0회" },
  },
  {
    title: "최다 참여",
    entries: [
      { rank: 1, name: "강석진", value: "15회" },
      { rank: 2, name: "김현호", value: "14회" },
      { rank: 3, name: "김민준", value: "11회" },
    ],
    currentUser: { name: "My NickName·18th", value: "2회" },
  },
];

export const searchOptions = [
  { value: "title", label: "제목" },
];

export const statusOptions = [
  { value: "all", label: "전체 상태", dotTone: "neutral" },
  { value: "active", label: "진행중", dotTone: "active" },
  { value: "upcoming", label: "예정", dotTone: "upcoming" },
  { value: "closed", label: "마감", dotTone: "closed" },
];

export const regionOptions = [
  { value: "all", label: "전체(지역)" },
  { value: "online", label: "온라인" },
  { value: "seoul", label: "서울" },
  { value: "gyeongbuk", label: "경북" },
  { value: "busan", label: "부산" },
  { value: "daejeon", label: "대전" },
  { value: "etc", label: "기타" },
];
