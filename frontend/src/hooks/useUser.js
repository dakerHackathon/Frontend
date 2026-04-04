import { useCallback } from "react";
import { API } from "../api/api_registry";
import { useApi } from "./common/useApi";

export const useUser = () => {
  const {
    execute: getTeamMembersExecute,
    isLoading: isGetTeamMembersLoading,
    error: getTeamMembersError,
  } = useApi(API.user.getTeamMembers);
  const {
    execute: searchUsersExecute,
    isLoading: isSearchUsersLoading,
    error: searchUsersError,
  } = useApi(API.user.search);

  const getTeamMembers = useCallback(
    async (userId, teamId) => {
      try {
        return await getTeamMembersExecute(userId, teamId);
      } catch (e) {
        console.error("팀원 사용자 정보 조회 중 에러:", e);
        return {
          isSuccess: false,
          message: e.response?.data?.message || "팀원 사용자 정보를 불러오는 중 오류가 발생했습니다.",
          data: { users: [] },
        };
      }
    },
    [getTeamMembersExecute],
  );

  const searchUsers = useCallback(
    async (keyword) => {
      try {
        return await searchUsersExecute(keyword);
      } catch (e) {
        console.error("사용자 검색 중 에러:", e);
        return {
          isSuccess: false,
          message: e.response?.data?.message || "사용자 검색 중 오류가 발생했습니다.",
          data: { users: [] },
        };
      }
    },
    [searchUsersExecute],
  );

  return {
    getTeamMembers,
    searchUsers,
    isLoading: isGetTeamMembersLoading || isSearchUsersLoading,
    userError: getTeamMembersError || searchUsersError,
  };
};
