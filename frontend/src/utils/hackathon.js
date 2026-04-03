import { getCurrentUser } from "./auth";

export const HACKATHON_SAVE_UPDATED_EVENT = "hackathon-save-updated";
export const HACKATHON_LIST_REFRESH_EVENT = "hackathon-list-refresh";

const parseApiDate = (value) => new Date(String(value).replace(" ", "T"));

const formatDateDot = (value) => String(value).slice(0, 10).replaceAll("-", ".");

const formatPeriod = (startAt, endAt) => `${formatDateDot(startAt)} ~ ${formatDateDot(endAt)}`;

const getStatusMeta = (startAt, endAt) => {
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

const getDdayLabel = (endAt, status) => {
  if (status === "closed") {
    return "D-0";
  }

  const now = new Date();
  const target = parseApiDate(endAt);
  const diffDays = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  return `D-${diffDays}`;
};

const createPosterContent = (title, subtitle, location) => ({
  season: "BLOOMING HACKATHON",
  headline: title,
  accent: subtitle || `${location}에서 열리는 해커톤 상세 정보를 확인해 보세요.`,
  brand: "BLOOMING",
});

const createPrizeItems = (prize = []) => {
  const tiers = ["대상", "최우수상", "우수상"];
  const tones = ["gold", "silver", "bronze"];

  return prize.map((amount, index) => ({
    tier: tiers[index] ?? `${index + 1}위`,
    amount: `${Number(amount).toLocaleString("ko-KR")}만원`,
    tone: tones[index] ?? "silver",
    description: `${index + 1}위 팀에게 제공되는 상금입니다.`,
  }));
};

const createSubmissionGuide = (submissionGuideText) => {
  const tips = String(submissionGuideText || "")
    .split(/[\n.]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    maxSize: "최대 50MB",
    deadline: "-",
    notePlaceholder: "제출 파일의 핵심 변경 사항과 참고 내용을 남겨 주세요.",
    tips:
      tips.length > 0
        ? tips
        : ["제출 가이드는 운영진 안내에 따라 준비해 주세요."],
  };
};

const createSubmissionSummary = () => [
  {
    name: "최종제출본.zip",
    date: "-",
    size: "0MB",
    status: "미제출",
  },
];

const buildSummaryMeta = (summary) => {
  if (summary?.start_at && summary?.end_at) {
    const statusMeta = getStatusMeta(summary.start_at, summary.end_at);

    return {
      status: statusMeta.status,
      statusLabel: statusMeta.statusLabel,
      dDay: getDdayLabel(summary.end_at, statusMeta.status),
      period: formatPeriod(summary.start_at, summary.end_at),
      isStar: Boolean(summary.isStar),
      startAt: summary.start_at,
      endAt: summary.end_at,
    };
  }

  return {
    status: "upcoming",
    statusLabel: "예정",
    dDay: "D-0",
    period: "-",
    isStar: false,
    startAt: null,
    endAt: null,
  };
};

export const getHackathonUserId = () => {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? currentUser?.id ?? 1;
};

export const notifyHackathonSaveUpdated = ({ hackathonId, isStar }) => {
  window.dispatchEvent(
    new CustomEvent(HACKATHON_SAVE_UPDATED_EVENT, {
      detail: {
        hackathonId,
        isStar,
      },
    }),
  );
};

export const notifyHackathonListRefresh = () => {
  window.dispatchEvent(new CustomEvent(HACKATHON_LIST_REFRESH_EVENT));
};

export const mapHackathonListItem = (item) => {
  const statusMeta = getStatusMeta(item.start_at, item.end_at);

  return {
    ...item,
    ...statusMeta,
    dDay: getDdayLabel(item.end_at, statusMeta.status),
    period: formatPeriod(item.start_at, item.end_at),
  };
};

export const mapHackathonListResponse = (hackathons = []) => hackathons.map(mapHackathonListItem);

export const mapHackathonDetailResponse = ({ detail, summary }) => {
  const summaryMeta = buildSummaryMeta(summary);
  const prizeItems = createPrizeItems(detail.prize);
  const poster = createPosterContent(
    detail.hackathonTitle,
    detail.hackathonSubTitle,
    detail.location,
  );

  return {
    id: detail.hackathonId,
    title: detail.hackathonTitle,
    subtitle: detail.hackathonSubTitle,
    summary: detail.description,
    host: detail.organizer,
    location: detail.location,
    schedule: (detail.schedule ?? []).map((item, index) => ({
      title: item.scheduleName,
      period: item.scheduleTime,
      active: index === 0,
    })),
    evaluation: (detail.evaluationCriteria ?? []).map((item) => ({
      label: item.name,
      weight: item.percent,
      score: item.percent,
    })),
    prize: {
      total: `총 상금 ${prizeItems
        .reduce((sum, item) => sum + Number(String(item.amount).replace(/[^\d]/g, "")), 0)
        .toLocaleString("ko-KR")}만원`,
      items: prizeItems,
    },
    teams: {
      count: detail.teams?.length ?? 0,
      items: (detail.teams ?? []).map((team) => ({
        name: team.teamName,
        members: `${team.number}명`,
      })),
    },
    submissions: createSubmissionSummary(),
    submissionGuide: createSubmissionGuide(detail.submissionGuide),
    leaderboard: {
      average: 0,
      note: detail.leaderBoard ? "최종 순위" : "심사 전",
      isPending: detail.leaderBoard === null,
      entries: (detail.leaderBoard ?? []).map((entry, index) => ({
        rank: index + 1,
        team: entry.teamName,
        score: null,
      })),
    },
    poster,
    ...summaryMeta,
  };
};
