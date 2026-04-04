// 랭킹 페이지 기준 탭 목록 (온도 / 최다참여 / 최다우승)
export const periodTabs = [
  { key: "temperature", label: "온도" },
  { key: "mostParticipation", label: "최다 참여" },
  { key: "mostWins", label: "최다 우승" },
];

// 순위 1~3위 메달 색상 토큰 (링, 라인, 배지, 카드 배경)
export const medalTones = {
  1: {
    ring: "ring-[#F2C94C]",
    line: "bg-[#F2C94C]",
    badge: "bg-[#F2C94C] text-white",
    card: "bg-[#EEF3FF]",
  },
  2: {
    ring: "ring-[#CFD8E8]",
    line: "bg-[#CFD8E8]",
    badge: "bg-[#CFD8E8] text-slate-700",
    card: "bg-white",
  },
  3: {
    ring: "ring-[#E2871A]",
    line: "bg-[#E2871A]",
    badge: "bg-[#E2871A] text-white",
    card: "bg-white",
  },
};

// 순위 배지 색상 토큰 (1~3위 전용, 나머지는 기본 색상 사용)
export const rankBadgeTones = {
  1: "bg-[#F2C94C] text-white",
  2: "bg-[#CFD8E8] text-slate-700",
  3: "bg-[#E2871A] text-white",
};
