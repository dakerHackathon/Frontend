const rankingProfiles = {
  1: {
    nickname: "김현호",
    github: "https://github.com/hyunho-dev",
    temperature: 95.2,
    avatar: { initials: "김", bg: "from-[#1C3D6E] to-[#537FBA]", ring: "ring-[#F2C94C]" },
  },
  2: {
    nickname: "강석진",
    github: "https://github.com/seokjin-dev",
    temperature: 98.2,
    avatar: { initials: "강", bg: "from-[#14213D] to-[#4361EE]", ring: "ring-[#CFD8E8]" },
  },
  3: {
    nickname: "김민준",
    github: null,
    temperature: 94.3,
    avatar: { initials: "김", bg: "from-[#2D2025] to-[#7C5E67]", ring: "ring-[#E2871A]" },
  },
  4: {
    nickname: "이승제",
    github: "https://github.com/seungje-lab",
    temperature: 92.4,
    avatar: { initials: "이", bg: "from-[#5B3B6A] to-[#AE8CC3]" },
  },
  5: {
    nickname: "김유진",
    github: null,
    temperature: 91.2,
    avatar: { initials: "김", bg: "from-[#425534] to-[#8FB174]" },
  },
  6: {
    nickname: "임윤아",
    github: "https://github.com/yoona-dev",
    temperature: 95.8,
    avatar: { initials: "임", bg: "from-[#5C68E8] to-[#B0B8FF]" },
  },
  7: {
    nickname: "한지민",
    github: null,
    temperature: 90.5,
    avatar: { initials: "한", bg: "from-[#3D4E3E] to-[#8AA47B]" },
  },
  8: {
    nickname: "차은우",
    github: null,
    temperature: 97.6,
    avatar: { initials: "차", bg: "from-[#4E5A67] to-[#A0AFBE]" },
  },
  9: {
    nickname: "배수지",
    github: "https://github.com/bae-suji",
    temperature: 93.1,
    avatar: { initials: "배", bg: "from-[#006B8F] to-[#48A7C7]" },
  },
  10: {
    nickname: "박보검",
    github: null,
    temperature: 93.8,
    avatar: { initials: "박", bg: "from-[#7A4A35] to-[#DAB39F]" },
  },
  18: {
    nickname: "My NickName",
    github: "https://github.com/my-nickname",
    temperature: 84.2,
    avatar: { initials: "M", bg: "from-[#5B6EFF] to-[#9EA9FF]" },
  },
};

const rankingPointByFilter = {
  temp: [
    { id: 5, point: 98.6 },
    { id: 8, point: 97.2 },
    { id: 2, point: 96.5 },
    { id: 1, point: 95.2 },
    { id: 6, point: 95.0 },
    { id: 3, point: 94.3 },
    { id: 4, point: 94.0 },
    { id: 10, point: 93.8 },
    { id: 9, point: 93.1 },
    { id: 7, point: 90.5 },
  ],
  part: [
    { id: 6, point: 28.0 },
    { id: 1, point: 25.0 },
    { id: 9, point: 22.0 },
    { id: 4, point: 21.0 },
    { id: 5, point: 20.0 },
    { id: 2, point: 20.0 },
    { id: 7, point: 19.0 },
    { id: 3, point: 18.0 },
    { id: 8, point: 17.0 },
    { id: 10, point: 16.0 },
  ],
  win: [
    { id: 10, point: 12.0 },
    { id: 3, point: 11.0 },
    { id: 2, point: 9.0 },
    { id: 4, point: 8.0 },
    { id: 1, point: 8.0 },
    { id: 5, point: 7.0 },
    { id: 6, point: 7.0 },
    { id: 7, point: 6.0 },
    { id: 8, point: 5.0 },
    { id: 9, point: 4.0 },
  ],
};

export const myRankingResponse = {
  temp: {
    rank: 20,
    point: 37.0,
    temperature: 84.2,
  },
  win: {
    rank: 10,
    point: 8.0,
    temperature: 84.2,
  },
  part: {
    rank: 23,
    point: 14.0,
    temperature: 84.2,
  },
};

const sidebarLabels = {
  temp: "°C",
  win: "회",
  part: "회",
};

const buildRankItem = (filter, entry) => {
  const profile = rankingProfiles[entry.id];

  return {
    id: entry.id,
    nickname: profile.nickname,
    github: profile.github,
    point: entry.point,
    // 현재 백엔드 명세에는 온도가 없지만, 랭킹 UI가 온도 막대를 쓰고 있어서
    // 실제 연동 전까지는 목업 응답에서 함께 내려 주는 형태로 유지한다.
    temperature: profile.temperature,
    avatar: profile.avatar,
  };
};

export const getRankingListResponse = (filter = "win") => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: {
    ranks: (rankingPointByFilter[filter] ?? rankingPointByFilter.win).map((entry) =>
      buildRankItem(filter, entry),
    ),
  },
});

export const getMyRankingResponse = () => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: myRankingResponse,
});

export const getRankingTop3Response = () => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: {
    temp: rankingPointByFilter.temp.slice(0, 3).map((entry, index) => ({
      nickname: rankingProfiles[entry.id].nickname,
      point: entry.point,
      rank: index + 1,
    })),
    win: rankingPointByFilter.win.slice(0, 3).map((entry, index) => ({
      nickname: rankingProfiles[entry.id].nickname,
      point: entry.point,
      rank: index + 1,
    })),
    part: rankingPointByFilter.part.slice(0, 3).map((entry, index) => ({
      nickname: rankingProfiles[entry.id].nickname,
      point: entry.point,
      rank: index + 1,
    })),
  },
});

export const getRankingProfile = (id) => rankingProfiles[id] ?? rankingProfiles[18];

export const formatSidebarValue = (filter, point) =>
  `${Number(point).toLocaleString("ko-KR")}${sidebarLabels[filter] ?? "점"}`;
