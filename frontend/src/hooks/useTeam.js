import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

const teamRoleRequestMap = {
  planner: 1,
  frontend: 2,
  backend: 3,
  designer: 4,
};

export const useTeam = () => {
  const {
    execute: createTeamExecute,
    isLoading: isCreateTeamLoading,
    error: createTeamError,
  } = useApi(API.team.create);

  const {
    execute: getLeaderTeamsExecute,
    isLoading: isGetLeaderTeamsLoading,
    error: leaderTeamsError,
  } = useApi(API.team.getLeaderTeams);

  const {
    execute: registerHackathonExecute,
    isLoading: isRegisterHackathonLoading,
    error: registerHackathonError,
  } = useApi(API.team.registerHackathon);

  const handleCreateTeam = useCallback(
    async (userId, teamData) => {
      const role = teamRoleRequestMap[teamData.role];

      // 현재 백엔드 명세에서 확인된 role 숫자 매핑만 요청에 사용합니다.
      if (!role) {
        return {
          isSuccess: false,
          message: "선택한 포지션 role 값 명세 확인이 필요합니다.",
        };
      }

      try {
        return await createTeamExecute(userId, {
          name: teamData.name,
          description: teamData.description,
          role,
        });
      } catch (error) {
        console.error("팀 생성 처리 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀 생성 중 오류가 발생했습니다.",
        };
      }
    },
    [createTeamExecute],
  );

  const getLeaderTeams = useCallback(
    async (userId) => {
      try {
        return await getLeaderTeamsExecute(userId);
      } catch (error) {
        console.error("리더 팀 목록 조회 중 에러:", error);
        return {
          isSuccess: false,
          message:
            error.response?.data?.message || "리더 팀 목록을 불러오는 중 오류가 발생했습니다.",
          data: { teams: [] },
        };
      }
    },
    [getLeaderTeamsExecute],
  );

  const registerHackathonTeam = useCallback(
    async (userId, teamId, hackathonId) => {
      try {
        return await registerHackathonExecute(userId, teamId, { hackathonId });
      } catch (error) {
        console.error("해커톤 참가 신청 중 에러:", error);
        return {
          isSuccess: false,
          message:
            error.response?.data?.message || "해커톤 참가 신청 중 오류가 발생했습니다.",
        };
      }
    },
    [registerHackathonExecute],
  );

  return {
    handleCreateTeam,
    getLeaderTeams,
    registerHackathonTeam,
    isLoading: isCreateTeamLoading || isGetLeaderTeamsLoading || isRegisterHackathonLoading,
    createTeamError,
    leaderTeamsError,
    registerHackathonError,
  };
};
