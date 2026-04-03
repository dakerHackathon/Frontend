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
