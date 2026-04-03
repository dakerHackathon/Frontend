import { http, HttpResponse } from "msw";
import {
  getLeaderTeamsByUserId,
  getRegisteredHackathonByTeamId,
  registerHackathonForTeam,
} from "../data/team";

export const teamHandlers = [
  http.get("*/camp/:userId/team", ({ params }) => {
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
