const createPrize = (grandTotal, amounts, descriptions) => ({
  total: `총 상금 ${grandTotal}`,
  items: [
    { tier: "대상", amount: amounts[0], tone: "gold", description: descriptions[0] },
    { tier: "최우수상", amount: amounts[1], tone: "silver", description: descriptions[1] },
    { tier: "우수상", amount: amounts[2], tone: "bronze", description: descriptions[2] },
  ],
});

export const hackathons = [
  {
    id: 1,
    slug: "ai-ideathon-2026",
    title: "AI 아이디어톤 2026",
    subtitle: "인공지능을 활용한 사회 문제 해결 프로젝트",
    status: "active",
    statusLabel: "진행중",
    dDay: "D-5",
    period: "2026.03.18 ~ 2026.03.19",
    location: "서울",
    contact: "없음",
    region: "seoul",
    host: "과학기술정보통신부",
    summary:
      "최신 AI 기술을 활용해 교육, 복지, 지역 사회의 문제를 해결하는 서비스를 설계하는 해커톤입니다. 기획부터 구현, 발표까지 전 과정을 짧고 밀도 있게 경험할 수 있습니다.",
    tags: ["#AI", "#문제해결", "#프로토타입"],
    poster: {
      season: "2026 SPRING",
      headline: "AI 아이디어톤 2026\n사회문제 해결 챌린지",
      accent: "아이디어를 실제 서비스 구조로 빠르게 구체화해 보세요.",
      brand: "BLOOMING HACKATHON",
    },
    schedule: [
      { title: "참가 신청", period: "2026.03.10 10:00", active: true },
      { title: "오리엔테이션", period: "2026.03.17 15:00" },
      { title: "본선 해커톤", period: "2026.03.18 12:00" },
      { title: "최종 발표", period: "2026.03.19 16:00" },
    ],
    evaluation: [
      { label: "문제 해결력", weight: 35, score: 85 },
      { label: "서비스 완성도", weight: 30, score: 82 },
      { label: "시장성", weight: 20, score: 78 },
      { label: "발표력", weight: 15, score: 88 },
    ],
    prize: createPrize(
      "1,100만원",
      ["500만원", "300만원", "300만원"],
      [
        "문제 정의와 구현 완성도가 가장 뛰어난 팀",
        "실행력과 확장 가능성이 우수한 팀",
        "아이디어와 발표력이 인상적인 팀",
      ],
    ),
    teams: {
      count: 2,
      items: [
        { name: "PayFlow", members: "4명", role: "기획 / 프론트", positions: ["PM", "FE"] },
        { name: "Vault Nine", members: "2명", role: "백엔드 / 보안", positions: ["BE", "AI"] },
      ],
    },
    submissions: [
      {
        name: "최종제출본.zip",
        date: "2026.03.19",
        size: "24.3MB",
        status: "제출완료",
      },
    ],
    submissionGuide: {
      deadline: "2026.03.19 23:59",
      notePlaceholder: "제출 버전, 변경사항, 심사 시 참고할 메모를 적어 주세요.",
      tips: [
        "압축 파일 하나로 제출해 주세요.",
        "실행 가이드와 주요 기능 소개를 포함해 주세요.",
        "최종 제출 이후에는 수정이 제한될 수 있습니다.",
      ],
    },
    leaderboard: {
      average: 83.8,
      note: "예선 통과 팀 평균",
      entries: [
        { rank: 1, team: "PayFlow", score: 92.4 },
        { rank: 2, team: "Vault Nine", score: 88.1 },
        { rank: 3, team: "Neural Crew", score: 85.6 },
      ],
    },
  },
  {
    id: 2,
    slug: "fintech-sprint-2026",
    title: "핀테크 스프린트 2026",
    subtitle: "금융 데이터 기반 고객 경험 개선 챌린지",
    status: "upcoming",
    statusLabel: "예정",
    dDay: "D-12",
    period: "2026.03.17 ~ 2026.03.18",
    location: "온라인",
    contact: "이메일 접수",
    region: "online",
    host: "서울핀테크랩",
    summary:
      "금융 데이터를 활용한 사용자 경험 개선 아이디어를 빠르게 설계하고 검증하는 해커톤입니다. 대시보드, 자산 관리, 리스크 분석 등 다양한 주제로 참여할 수 있습니다.",
    tags: ["#핀테크", "#데이터", "#서비스기획"],
    poster: {
      season: "2026 FINTECH",
      headline: "핀테크 스프린트 2026\n고객 경험 재설계",
      accent: "금융 데이터를 바탕으로 실질적인 사용자 문제를 해결해 보세요.",
      brand: "SEOUL FINTECH LAB",
    },
    schedule: [
      { title: "참가 신청", period: "2026.03.01 09:00", active: true },
      { title: "오리엔테이션", period: "2026.03.16 19:00" },
      { title: "본선 해커톤", period: "2026.03.17 12:00" },
      { title: "최종 발표", period: "2026.03.18 18:00" },
    ],
    evaluation: [
      { label: "문제 해결력", weight: 35, score: 81 },
      { label: "서비스 완성도", weight: 30, score: 79 },
      { label: "시장성", weight: 20, score: 76 },
      { label: "발표력", weight: 15, score: 84 },
    ],
    prize: createPrize(
      "1,100만원",
      ["500만원", "300만원", "300만원"],
      [
        "사용자 문제와 솔루션 연결이 가장 뛰어난 팀",
        "시장 적합성과 실현 가능성이 높은 팀",
        "발표력과 스토리텔링이 인상적인 팀",
      ],
    ),
    teams: {
      count: 2,
      items: [
        { name: "Market Wave", members: "4명", role: "기획 / 프론트", positions: ["PM", "FE"] },
        { name: "Risk Zero", members: "3명", role: "백엔드 / 데이터", positions: ["BE", "DB"] },
      ],
    },
    submissions: [
      {
        name: "최종제출본.zip",
        date: "-",
        size: "0MB",
        status: "미제출",
      },
    ],
    submissionGuide: {
      deadline: "2026.03.18 23:59",
      notePlaceholder: "제출 전에 구현 범위와 시연 포인트를 정리해 주세요.",
      tips: [
        "제출 파일은 zip 하나로 통일합니다.",
        "서비스 소개 문서와 데모 링크를 함께 포함해 주세요.",
        "마감 이후 제출은 인정되지 않습니다.",
      ],
    },
    leaderboard: {
      average: 0,
      note: "심사 전",
      entries: [],
    },
  },
  {
    id: 3,
    slug: "green-data-hackathon",
    title: "그린 데이터 해커톤",
    subtitle: "환경 데이터를 활용한 지속가능 서비스 설계",
    status: "closed",
    statusLabel: "마감",
    dDay: "D-0",
    period: "2026.03.17 ~ 2026.03.18",
    location: "경북",
    contact: "운영진 문의",
    region: "gyeongbuk",
    host: "경북테크노파크",
    summary:
      "환경 데이터를 기반으로 지역 문제를 해결하는 서비스 아이디어를 구현하는 해커톤입니다. 데이터 활용도, 현장 적합성, 서비스 확장성을 중심으로 평가합니다.",
    tags: ["#환경", "#데이터", "#지역문제"],
    poster: {
      season: "2026 GREEN",
      headline: "그린 데이터 해커톤\n지속가능 서비스 설계",
      accent: "지역과 환경 문제를 해결하는 데이터 기반 솔루션을 제안해 보세요.",
      brand: "GB TECHNOPARK",
    },
    schedule: [
      { title: "참가 신청", period: "2026.03.01 09:00" },
      { title: "오리엔테이션", period: "2026.03.16 14:00" },
      { title: "본선 해커톤", period: "2026.03.17 12:00", active: true },
      { title: "최종 발표", period: "2026.03.18 17:00" },
    ],
    evaluation: [
      { label: "환경 파급력", weight: 40, score: 87 },
      { label: "기술 구현 가능성", weight: 25, score: 80 },
      { label: "서비스 확장성", weight: 20, score: 75 },
      { label: "작업 완성도", weight: 15, score: 88 },
    ],
    prize: createPrize(
      "1,100만원",
      ["500만원", "300만원", "300만원"],
      [
        "환경 문제 해결 효과가 가장 뛰어난 팀",
        "기술 완성도와 현장 적용성이 높은 팀",
        "확장 가능성과 발표력이 우수한 팀",
      ],
    ),
    teams: {
      count: 2,
      items: [
        { name: "Green Pulse", members: "4명", role: "데이터 / 기획", positions: ["DB", "PM"] },
        { name: "Eco Beam", members: "2명", role: "백엔드 / AI", positions: ["BE", "AI"] },
      ],
    },
    submissions: [
      {
        name: "최종제출본.zip",
        date: "2026.03.18",
        size: "31.8MB",
        status: "제출완료",
      },
    ],
    submissionGuide: {
      deadline: "2026.03.18 22:00",
      notePlaceholder: "실행 환경과 주요 기능, 데이터 출처를 정리해 주세요.",
      tips: [
        "시연에 필요한 파일은 모두 zip 안에 포함해 주세요.",
        "데이터 출처와 활용 방식을 문서로 함께 정리해 주세요.",
        "발표 자료는 선택 사항이지만 권장됩니다.",
      ],
    },
    leaderboard: {
      average: 84.4,
      note: "최종 심사 평균",
      entries: [
        { rank: 1, team: "Green Pulse", score: 93.6 },
        { rank: 2, team: "Eco Beam", score: 88.4 },
        { rank: 3, team: "Carbon Cut", score: 85.2 },
      ],
    },
  },
];

const toApiDateTime = (dateText, hour = "12:00") => `${dateText} ${hour}`;

const getDateRange = (period) => {
  const [startDate = "", endDate = ""] = period.split(" ~ ");
  return {
    start_at: toApiDateTime(startDate),
    end_at: toApiDateTime(endDate),
  };
};

const getScheduleBaseDate = (hackathon) => getDateRange(hackathon.period).start_at.slice(0, 10);

const toScheduleTime = (hackathon, index) => {
  const hour = String(5 + index * 5).padStart(2, "0");
  return `${getScheduleBaseDate(hackathon)} ${hour}:05`;
};

const parsePrizeAmount = (value) => {
  const matched = String(value).match(/\d[\d,]*/);
  return matched ? Number(matched[0].replaceAll(",", "")) : 0;
};

const parseTeamNumber = (value) => {
  const matched = String(value).match(/\d+/);
  return matched ? Number(matched[0]) : 0;
};

const buildLeaderBoard = (hackathon) => {
  if (hackathon.status !== "closed") {
    return null;
  }

  return hackathon.leaderboard.entries.map((entry) => ({
    teamId: entry.rank,
    teamName: entry.team,
  }));
};

export const getHackathonListResponse = () => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data: {
    hackathons: hackathons.map((hackathon) => {
      const { start_at, end_at } = getDateRange(hackathon.period);

      return {
        id: hackathon.id,
        slug: hackathon.slug,
        title: hackathon.title,
        start_at,
        end_at,
        location: hackathon.location,
        isStar: false,
      };
    }),
  },
});

export const getHackathonDetailResponse = (hackathonId) => {
  const hackathon = hackathons.find((item) => String(item.id) === String(hackathonId));

  if (!hackathon) {
    return null;
  }

  return {
    isSuccess: true,
    code: "200",
    message: "요청이 성공적입니다.",
    data: {
      hackathonId: hackathon.id,
      hackathonTitle: hackathon.title,
      hackathonSubTitle: hackathon.subtitle,
      description: hackathon.summary,
      organizer: hackathon.host,
      location: hackathon.location,
      schedule: hackathon.schedule.map((item, index) => ({
        scheduleName: item.title,
        scheduleTime: toScheduleTime(hackathon, index),
      })),
      submissionGuide: hackathon.submissionGuide.tips.join(" "),
      evaluationCriteria: hackathon.evaluation.map((item) => ({
        name: item.label,
        percent: item.weight,
      })),
      prize: hackathon.prize.items.map((item) => parsePrizeAmount(item.amount)),
      teams: hackathon.teams.items.map((team, index) => ({
        teamId: index + 1,
        teamName: team.name,
        number: parseTeamNumber(team.members),
      })),
      leaderBoard: buildLeaderBoard(hackathon),
    },
  };
};

export const getHackathonById = (id) =>
  hackathons.find((hackathon) => String(hackathon.id) === String(id));

export const getHackathonBySlug = (slug) => hackathons.find((hackathon) => hackathon.slug === slug);
