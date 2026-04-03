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

  const { execute: getDetailExecute } = useApi(API.team.getDetail);
  const { execute: updateExecute } = useApi(API.team.update);
  const { execute: updateMemberExecute } = useApi(API.team.updateMember);
  const { execute: deleteTeamExecute } = useApi(API.team.deleteTeam);
  const { execute: leaveTeamExecute } = useApi(API.team.leaveTeam);
  const { execute: expellMemberExecute } = useApi(API.team.expellMember);
  const { execute: inviteExecute } = useApi(API.team.invite);

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

  const getTeamDetail = useCallback(
    async (userId, teamId) => {
      try {
        return await getDetailExecute(userId, teamId);
      } catch (error) {
        console.error("팀 상세 조회 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀 상세 정보를 불러오는 중 오류가 발생했습니다.",
        };
      }
    },
    [getDetailExecute],
  );

  const updateTeam = useCallback(
    async (userId, teamId, data) => {
      try {
        return await updateExecute(userId, teamId, data);
      } catch (error) {
        console.error("팀 정보 수정 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀 정보 수정 중 오류가 발생했습니다.",
        };
      }
    },
    [updateExecute],
  );

  const updateMemberPosition = useCallback(
    async (userId, teamId, data) => {
      try {
        return await updateMemberExecute(userId, teamId, data);
      } catch (error) {
        console.error("팀원 포지션 수정 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀원 포지션 수정 중 오류가 발생했습니다.",
        };
      }
    },
    [updateMemberExecute],
  );

  const deleteTeam = useCallback(
    async (userId, data) => {
      try {
        return await deleteTeamExecute(userId, data);
      } catch (error) {
        console.error("팀 해체 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀 해체 중 오류가 발생했습니다.",
        };
      }
    },
    [deleteTeamExecute],
  );

  const leaveTeam = useCallback(
    async (userId, data) => {
      try {
        return await leaveTeamExecute(userId, data);
      } catch (error) {
        console.error("팀 탈퇴 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀 탈퇴 중 오류가 발생했습니다.",
        };
      }
    },
    [leaveTeamExecute],
  );

  const expellMember = useCallback(
    async (userId, data) => {
      try {
        return await expellMemberExecute(userId, data);
      } catch (error) {
        console.error("팀원 내보내기 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀원 내보내기 중 오류가 발생했습니다.",
        };
      }
    },
    [expellMemberExecute],
  );

  const inviteMember = useCallback(
    async (userId, teamId, data) => {
      try {
        return await inviteExecute(userId, teamId, data);
      } catch (error) {
        console.error("팀원 초대 중 에러:", error);
        return {
          isSuccess: false,
          message: error.response?.data?.message || "팀원 초대 중 오류가 발생했습니다.",
        };
      }
    },
    [inviteExecute],
  );

  return {
    handleCreateTeam,
    getLeaderTeams,
    getTeamDetail,
    updateTeam,
    updateMemberPosition,
    deleteTeam,
    leaveTeam,
    expellMember,
    inviteMember,
    registerHackathonTeam,
    isLoading: isCreateTeamLoading || isGetLeaderTeamsLoading || isRegisterHackathonLoading,
    createTeamError,
    leaderTeamsError,
    registerHackathonError,
  };
};
