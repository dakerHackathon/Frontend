import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

const teamRoleRequestMap = {
  planner: 1,
  frontend: 2,
  backend: 3,
  designer: 4,
};

export const useTeam = () => {
  const createTeamApi = useApi(API.team.create);
  const detailTeamApi = useApi(API.team.detail);

  const handleCreateTeam = async (userId, teamData) => {
    const role = teamRoleRequestMap[teamData.role];

    // 현재 확인된 숫자 매핑만 요청에 사용합니다.
    if (!role) {
      return {
        isSuccess: false,
        message: "선택한 포지션의 role 값 명세 확인이 필요합니다.",
      };
    }

    try {
      const result = await createTeamApi.execute(userId, {
        name: teamData.name,
        description: teamData.description,
        role,
      });

      return result;
    } catch (e) {
      console.error("팀 생성 처리 중 에러:", e);
      return {
        isSuccess: false,
        message:
          e.response?.data?.message || "팀 생성 중 오류가 발생했습니다.",
      };
    }
  };

  const getTeamDetail = async (userId, teamId) => {
    try {
      const result = await detailTeamApi.execute(userId, teamId);
      return result;
    } catch (e) {
      console.error("팀 상세 조회 중 에러:", e);
      return {
        isSuccess: false,
        message:
          e.response?.data?.message || "팀 상세 정보를 불러오는 중 오류가 발생했습니다.",
      };
    }
  };

  return {
    handleCreateTeam,
    getTeamDetail,
    isLoading: createTeamApi.isLoading || detailTeamApi.isLoading,
    createTeamError: createTeamApi.error,
    teamDetailError: detailTeamApi.error,
  };
};
