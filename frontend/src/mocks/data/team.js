// 팀 상세 mock 데이터 - 실제 데이터와 구분되도록 "msw-" 접두사 사용
export const teamDetailByTeamId = {
  2: {
    team: {
      teamId: 2,
      teamName: "msw-test-팀블루밍",
      description: "mock-data: 팀 블루밍 설명입니다.",
    },
    member: [
      { userId: 1, nickName: "msw-test-user", position: 1, isLeader: true },
      { userId: 2, nickName: "mock-member-FE", position: 2, isLeader: false },
    ],
    hackathon: {
      hackathonId: 1,
      hackathonName: "mock-hackathon",
      startAt: "2026-03-20",
      endAt: "2026-04-02",
    },
  },
  4: {
    team: {
      teamId: 4,
      teamName: "msw-test-데이터메이커스",
      description: "mock-data: 데이터 메이커스 설명입니다.",
    },
    member: [
      { userId: 1, nickName: "msw-test-user", position: 1, isLeader: true },
      { userId: 3, nickName: "mock-member-BE", position: 3, isLeader: false },
    ],
    hackathon: null,
  },
};

export const leaderTeamsByUserId = {
  1: [
    { teamId: 2, teamName: "팀 블루밍" },
    { teamId: 4, teamName: "데이터 메이커스" },
  ],
  2: [{ teamId: 6, teamName: "AI 스프린트" }],
};

const registeredHackathonsByTeamId = new Map();

export const getLeaderTeamsByUserId = (userId) => leaderTeamsByUserId[String(userId)] ?? [];

export const registerHackathonForTeam = ({ teamId, hackathonId }) => {
  registeredHackathonsByTeamId.set(String(teamId), Number(hackathonId));
};

export const getRegisteredHackathonByTeamId = (teamId) =>
  registeredHackathonsByTeamId.get(String(teamId)) ?? null;
