import { bypass, http, HttpResponse } from "msw";
import {
  getLeaderTeamsByUserId,
  getRegisteredHackathonByTeamId,
  registerHackathonForTeam,
  teamDetailByTeamId,
} from "../data/team";

// 응답 상태를 한 곳에서 바꾸면 200/401/500 동작을 바로 확인할 수 있습니다.
const teamMockStatus = "fallback";

const getMockErrorResponse = () => {
  if (teamMockStatus === "unauthorized") {
    return HttpResponse.json(
      { isSuccess: false, code: "401", message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  if (teamMockStatus === "serverError") {
    return HttpResponse.json(
      { isSuccess: false, code: "500", message: "서버 오류" },
      { status: 500 },
    );
  }

  return null;
};

const tryPassThrough = async (request, warnMessage) => {
  if (teamMockStatus !== "fallback") {
    return null;
  }

  try {
    const response = await fetch(bypass(request));
    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("application/json")) {
      return response;
    }

    console.warn(warnMessage);
  } catch (error) {
    console.warn(warnMessage, error);
  }

  return null;
};

export const teamHandlers = [
  // 팀 상세 조회 - GET /camp/:userId/team/:teamId
  // leave, expell 경로보다 먼저 등록되면 "leave"를 teamId로 오인하므로 뒤에 위치
  http.get("*/camp/:userId/team/:teamId", async ({ params, request }) => {
    console.log("✅ MSW intercepted: GET /camp/:userId/team/:teamId", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const passThroughResponse = await tryPassThrough(
      request,
      `MSW fallback to mock for GET /camp/${params.userId}/team/${params.teamId}: 실서버 응답을 사용할 수 없습니다.`,
    );
    if (passThroughResponse) {
      return passThroughResponse;
    }

    const detail = teamDetailByTeamId[Number(params.teamId)];
    if (!detail) {
      return HttpResponse.json({ isSuccess: false, code: "404", message: "팀을 찾을 수 없습니다." }, { status: 404 });
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
      data: detail,
    });
  }),

  // 팀 탈퇴 - PATCH /camp/:userId/team/leave
  // ⚠️ "/team/leave"가 "/team/:teamId"보다 먼저 등록되어야 합니다.
  // 나중에 등록하면 "leave"가 :teamId로 매칭되어 이 핸들러가 실행되지 않습니다.
  http.patch("*/camp/:userId/team/leave", async ({ params }) => {
    console.log("✅ MSW intercepted: PATCH /camp/:userId/team/leave", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),

  // 팀원 내보내기 - PATCH /camp/:userId/team/expell
  // ⚠️ 동일한 이유로 "/team/:teamId"보다 먼저 등록합니다.
  http.patch("*/camp/:userId/team/expell", async ({ params }) => {
    console.log("✅ MSW intercepted: PATCH /camp/:userId/team/expell", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),

  // 팀원 포지션 수정 - PATCH /camp/:userId/team/:teamId/member
  http.patch("*/camp/:userId/team/:teamId/member", async ({ params }) => {
    console.log("✅ MSW intercepted: PATCH /camp/:userId/team/:teamId/member", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),

  // 팀 정보 수정 - PATCH /camp/:userId/team/:teamId
  http.patch("*/camp/:userId/team/:teamId", async ({ params }) => {
    console.log("✅ MSW intercepted: PATCH /camp/:userId/team/:teamId", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
      data: { teamId: Number(params.teamId) },
    });
  }),

  // 팀 해체 - DELETE /camp/:userId/team
  http.delete("*/camp/:userId/team", async ({ params, request }) => {
    console.log("✅ MSW intercepted: DELETE /camp/:userId/team", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const passThroughResponse = await tryPassThrough(
      request,
      `MSW fallback to mock for DELETE /camp/${params.userId}/team: 실서버 응답을 사용할 수 없습니다.`,
    );
    if (passThroughResponse) {
      return passThroughResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),

  // 팀원 초대 - POST /camp/:userId/invite/:teamId
  http.post("*/camp/:userId/invite/:teamId", async ({ params }) => {
    console.log("✅ MSW intercepted: POST /camp/:userId/invite/:teamId", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),

  http.get("*/camp/:userId/team", ({ params }) => {
    console.log("✅ MSW intercepted: GET /camp/:userId/team", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const { userId } = params;

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
      data: {
        teams: getLeaderTeamsByUserId(userId),
      },
    });
  }),

  http.post("*/camp/:userId/team/:teamId/register", async ({ params, request }) => {
    console.log("✅ MSW intercepted: POST /camp/:userId/team/:teamId/register", params);

    const mockErrorResponse = getMockErrorResponse();
    if (mockErrorResponse) {
      return mockErrorResponse;
    }

    const { teamId } = params;
    const { hackathonId } = await request.json();

    if (!hackathonId) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "400",
          message: "해커톤 ID가 필요합니다.",
        },
        { status: 400 },
      );
    }

    const existingHackathonId = getRegisteredHackathonByTeamId(teamId);
    if (existingHackathonId && existingHackathonId !== Number(hackathonId)) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "409",
          message: "이미 다른 해커톤에 참가 중인 팀입니다.",
        },
        { status: 409 },
      );
    }

    registerHackathonForTeam({ teamId, hackathonId });

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
];
