// 랭킹 페이지 기간 탭 목록 (주간 / 월간 / 누적)
export const periodTabs = [
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
  { key: "cumulative", label: "누적" },
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
