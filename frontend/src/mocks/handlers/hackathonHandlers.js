import { http, HttpResponse } from "msw";
import {
  getHackathonById,
  getHackathonBySlug,
  getSavedHackathonIdsByUserId,
  hackathons,
  toggleSavedHackathon,
} from "../data/hackathons";

// 현재는 해커톤 목록/상세를 MSW로 내려 주고, 실제 API 연동 시 같은 응답 shape를 유지한다.
// true로 바꾸면 500 응답을 반환해서 에러 UI를 테스트할 수 있다.
const shouldFail = false;

const createSuccessResponse = (data) => ({
  isSuccess: true,
  code: "200",
  message: "요청이 성공적입니다.",
  data,
});

const createErrorResponse = (code, message, status) =>
  HttpResponse.json(
    {
      isSuccess: false,
      code,
      message,
      data: null,
    },
    { status },
  );

const toApiDateTime = (dateText, hour = "12:00") => `${dateText} ${hour}`;

const getDateRange = (period) => {
  const [startDate = "", endDate = ""] = period.split(" ~ ");
  const toDash = (value) => value.replaceAll(".", "-");

  return {
    start_at: toApiDateTime(toDash(startDate)),
    end_at: toApiDateTime(toDash(endDate)),
  };
};

const getScheduleTime = (hackathon, index) => {
  const { start_at } = getDateRange(hackathon.period);
  const hour = String(5 + index * 5).padStart(2, "0");

  return `${start_at.slice(0, 10)} ${hour}:05`;
};

const parsePrizeAmount = (value) => {
  const matched = String(value).match(/\d[\d,]*/);
  return matched ? Number(matched[0].replaceAll(",", "")) : 0;
};

const parseTeamNumber = (value) => {
  const matched = String(value).match(/\d+/);
  return matched ? Number(matched[0]) : 0;
};

const mapHackathonListItem = (hackathon) => {
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
};

const mapLeaderBoard = (hackathon) => {
  if (hackathon.status !== "closed") {
    return null;
  }

  return hackathon.leaderboard.entries.map((entry) => ({
    teamId: entry.rank,
    teamName: entry.team,
  }));
};

const mapHackathonDetail = (hackathon, userId) => ({
  hackathonId: hackathon.id,
  hackathonTitle: hackathon.title,
  hackathonSubTitle: hackathon.subtitle,
  description: hackathon.summary,
  organizer: hackathon.host,
  location: hackathon.location,
  isStar: new Set(getSavedHackathonIdsByUserId(userId)).has(hackathon.id),
  schedule: hackathon.schedule.map((item, index) => ({
    scheduleName: item.title,
    scheduleTime: getScheduleTime(hackathon, index),
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
  leaderBoard: mapLeaderBoard(hackathon),
});

export const hackathonHandlers = [
  // 1. 해커톤 목록 조회
  http.get("*/hackathons/:userId", ({ params }) => {
    console.log(`MSW intercepted: GET /hackathons/${params.userId}`);

    if (shouldFail) {
      return createErrorResponse("500", "서버 오류가 발생했습니다.", 500);
    }

    const savedIds = new Set(getSavedHackathonIdsByUserId(params.userId ?? "1"));

    return HttpResponse.json(
      createSuccessResponse({
        hackathons: hackathons.map((hackathon) => ({
          ...mapHackathonListItem(hackathon),
          isStar: savedIds.has(hackathon.id),
        })),
      }),
    );
  }),

  // 2. 해커톤 상세 조회
  http.get("*/hackathons/:userId/:id", ({ params }) => {
    console.log(`MSW intercepted: GET /hackathons/${params.userId}/${params.id}`);

    const hackathon = getHackathonById(params.id) ?? getHackathonBySlug(params.id);

    if (!hackathon) {
      return createErrorResponse("404", "해커톤을 찾을 수 없습니다.", 404);
    }

    return HttpResponse.json(
      createSuccessResponse(mapHackathonDetail(hackathon, params.userId ?? "1")),
    );
  }),
  http.post("*/hackathons/:userId/save", async ({ params, request }) => {
    console.log(`MSW intercepted: POST /hackathons/${params.userId}/save`);

    const body = await request.json();
    const hackathonId = Number(body.hackathonId);

    if (!hackathonId) {
      return createErrorResponse("400", "해커톤 ID가 필요합니다.", 400);
    }

    toggleSavedHackathon({
      userId: params.userId,
      hackathonId,
    });

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
];
