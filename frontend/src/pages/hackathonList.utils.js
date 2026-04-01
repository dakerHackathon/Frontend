export const parseApiDate = (value) => new Date(value.replace(" ", "T"));

export const formatDateDot = (value) => value.slice(0, 10).replaceAll("-", ".");

export const formatPeriod = (startAt, endAt) =>
  `${formatDateDot(startAt)} ~ ${formatDateDot(endAt)}`;

export const getStatusMeta = (startAt, endAt) => {
  const now = new Date();
  const startDate = parseApiDate(startAt);
  const endDate = parseApiDate(endAt);

  if (now < startDate) {
    return { status: "upcoming", statusLabel: "예정" };
  }

  if (now > endDate) {
    return { status: "closed", statusLabel: "마감" };
  }

  return { status: "active", statusLabel: "진행중" };
};

export const getDdayLabel = (endAt, status) => {
  if (status === "closed") {
    return "D-0";
  }

  const now = new Date();
  const target = parseApiDate(endAt);
  const diffDays = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  return `D-${diffDays}`;
};

export const getRegionValue = (location) => {
  const normalized = location.trim().toLowerCase();

  if (normalized.includes("온라인")) return "online";
  if (normalized.includes("서울")) return "seoul";
  if (normalized.includes("경북")) return "gyeongbuk";
  if (normalized.includes("부산")) return "busan";
  if (normalized.includes("대전")) return "daejeon";

  return "etc";
};
